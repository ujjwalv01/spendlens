import {
  AuditInput,
  getToolById,
  getPlanById,
} from '@/lib/pricingData'

export type AuditResult = {
  toolId: string
  toolName: string
  currentPlanName: string
  currentMonthlySpend: number
  recommendedAction: string
  recommendedPlanName: string | null
  recommendedToolName: string | null
  monthlySavings: number
  annualSavings: number
  reason: string
  severity: 'high' | 'medium' | 'optimal'
}

export type AuditSummary = {
  results: AuditResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  highSavingsCount: number
}

type RecommendationCandidate = {
  action: string
  planName: string | null
  toolName: string | null
  savings: number
  reason: string
  severity: 'high' | 'medium'
}

export function runAudit(inputs: AuditInput[]): AuditSummary {
  const results: AuditResult[] = []

  for (const input of inputs) {
    const tool = getToolById(input.toolId)
    const plan = getPlanById(input.toolId, input.planId)

    if (!tool || !plan) continue

    const candidates: RecommendationCandidate[] = []

    // CHECK 1 — Wrong plan for seat count
    const teamTools = ['claude', 'chatgpt', 'cursor', 'windsurf']
    const isTeamPlan =
      input.planId === 'team' || input.planId === 'teams'
    if (teamTools.includes(input.toolId) && isTeamPlan && input.seats === 1) {
      let individualPrice = 0
      let individualName = ''

      if (input.toolId === 'claude') {
        individualPrice = 20
        individualName = 'Pro'
      } else if (input.toolId === 'chatgpt') {
        individualPrice = 20
        individualName = 'Plus'
      } else if (input.toolId === 'cursor') {
        individualPrice = 20
        individualName = 'Pro'
      } else if (input.toolId === 'windsurf') {
        individualPrice = 15
        individualName = 'Pro'
      }

      const savings = input.monthlySpend - individualPrice * input.seats
      if (savings > 0) {
        candidates.push({
          action: `Downgrade to ${individualName} plan`,
          planName: individualName,
          toolName: tool.toolName,
          savings,
          reason: `Team plan requires minimum 2 seats — you're paying team rates for a single user`,
          severity: 'high',
        })
      }
    }

    // CHECK 2 — Cheaper plan from same tool exists (Overpaying)
    const listedPrice = plan.pricePerUserPerMonth * input.seats
    if (input.monthlySpend > listedPrice) {
      const savings = input.monthlySpend - listedPrice
      candidates.push({
        action: 'Update billing to correct plan price',
        planName: plan.planName,
        toolName: tool.toolName,
        savings,
        reason: 'Your current spend exceeds the listed plan price',
        severity: 'medium',
      })
    }

    // CHECK 3 — Cheaper alternative tool
    // Cursor to Windsurf
    if (
      input.useCase === 'coding' &&
      input.toolId === 'cursor' &&
      plan.pricePerUserPerMonth >= 40
    ) {
      const windsurfPrice = 15
      const savings = input.monthlySpend - windsurfPrice * input.seats
      if (savings > 0) {
        candidates.push({
          action: 'Switch to Windsurf Pro',
          planName: 'Pro',
          toolName: 'Windsurf',
          savings,
          reason: `Windsurf Pro offers similar coding assistance at $15/user vs $${plan.pricePerUserPerMonth}/user — saving $${savings.toFixed(2)}/month for your team size`,
          severity: savings > 50 ? 'high' : 'medium',
        })
      }
    }

    // Copilot higher tiers to Copilot Pro
    if (
      input.useCase === 'coding' &&
      input.toolId === 'github-copilot' &&
      plan.pricePerUserPerMonth > 10 &&
      input.seats === 1
    ) {
      const copilotProPrice = 10
      const savings = input.monthlySpend - copilotProPrice
      if (savings > 0) {
        candidates.push({
          action: 'Switch to GitHub Copilot Pro',
          planName: 'Pro',
          toolName: 'GitHub Copilot',
          savings,
          reason:
            'GitHub Copilot Pro at $10/month covers individual developers — Pro+ is only needed for 5x more premium requests',
          severity: 'medium',
        })
      }
    }

    // ChatGPT to Claude Pro for writing
    if (
      input.useCase === 'writing' &&
      input.toolId === 'chatgpt' &&
      plan.pricePerUserPerMonth >= 30
    ) {
      const claudeProPrice = 20
      const savings = input.monthlySpend - claudeProPrice * input.seats
      if (savings > 0) {
        candidates.push({
          action: 'Switch to Claude Pro',
          planName: 'Pro',
          toolName: 'Claude',
          savings,
          reason: `Claude Pro at $20/month matches ChatGPT Team for writing tasks at a lower per-seat cost`,
          severity: savings > 20 ? 'high' : 'medium',
        })
      }
    }

    // Pick the highest savings candidate
    const bestCandidate = candidates.reduce<RecommendationCandidate | null>(
      (best, current) => {
        if (!best || current.savings > best.savings) return current
        return best
      },
      null
    )

    if (bestCandidate && bestCandidate.savings > 0) {
      results.push({
        toolId: tool.toolId,
        toolName: tool.toolName,
        currentPlanName: plan.planName,
        currentMonthlySpend: Number(input.monthlySpend.toFixed(2)),
        recommendedAction: bestCandidate.action,
        recommendedPlanName: bestCandidate.planName,
        recommendedToolName: bestCandidate.toolName,
        monthlySavings: Number(bestCandidate.savings.toFixed(2)),
        annualSavings: Number((bestCandidate.savings * 12).toFixed(2)),
        reason: bestCandidate.reason,
        severity: bestCandidate.severity,
      })
    } else {
      // CHECK 4 — Optimal
      results.push({
        toolId: tool.toolId,
        toolName: tool.toolName,
        currentPlanName: plan.planName,
        currentMonthlySpend: Number(input.monthlySpend.toFixed(2)),
        recommendedAction: 'No change needed',
        recommendedPlanName: null,
        recommendedToolName: null,
        monthlySavings: 0,
        annualSavings: 0,
        reason: 'You are on the right plan for your usage',
        severity: 'optimal',
      })
    }
  }

  const { monthlyTotal, annualTotal } = getTotalSavings(results)
  const highSavingsCount = results.filter((r) => r.severity === 'high').length

  return {
    results,
    totalMonthlySavings: Number(monthlyTotal.toFixed(2)),
    totalAnnualSavings: Number(annualTotal.toFixed(2)),
    highSavingsCount,
  }
}

export function getTotalSavings(results: AuditResult[]): {
  monthlyTotal: number
  annualTotal: number
} {
  const monthlyTotal = results.reduce((sum, r) => sum + r.monthlySavings, 0)
  const annualTotal = monthlyTotal * 12
  return {
    monthlyTotal,
    annualTotal,
  }
}

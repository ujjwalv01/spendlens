import { runAudit } from '@/lib/auditEngine'
import { AuditInput } from '@/lib/pricingData'

describe('auditEngine', () => {

  test('1 — detects team plan for single user and recommends individual plan', () => {
    const input: AuditInput[] = [{
      toolId: 'claude',
      planId: 'team',
      seats: 1,
      monthlySpend: 30,
      useCase: 'writing'
    }]
    const result = runAudit(input)
    expect(result.results[0].monthlySavings).toBeGreaterThan(0)
    expect(result.results[0].severity).toBe('high')
  })

  test('2 — detects overpaying vs listed price', () => {
    const input: AuditInput[] = [{
      toolId: 'cursor',
      planId: 'pro',
      seats: 1,
      monthlySpend: 50,
      useCase: 'coding'
    }]
    const result = runAudit(input)
    expect(result.results[0].monthlySavings).toBeGreaterThan(0)
  })

  test('3 — returns optimal when already on right plan', () => {
    const input: AuditInput[] = [{
      toolId: 'windsurf',
      planId: 'pro',
      seats: 1,
      monthlySpend: 15,
      useCase: 'coding'
    }]
    const result = runAudit(input)
    expect(result.results[0].severity).toBe('optimal')
    expect(result.results[0].monthlySavings).toBe(0)
  })

  test('4 — suggests Windsurf for coding use case on expensive Cursor plan', () => {
    const input: AuditInput[] = [{
      toolId: 'cursor',
      planId: 'teams',
      seats: 3,
      monthlySpend: 120,
      useCase: 'coding'
    }]
    const result = runAudit(input)
    expect(result.results[0].recommendedToolName).toBe('Windsurf')
    expect(result.results[0].monthlySavings).toBeGreaterThan(0)
  })

  test('5 — getTotalSavings correctly sums across multiple tools', () => {
    const input: AuditInput[] = [
      {
        toolId: 'claude',
        planId: 'team',
        seats: 1,
        monthlySpend: 30,
        useCase: 'writing'
      },
      {
        toolId: 'chatgpt',
        planId: 'team',
        seats: 1,
        monthlySpend: 30,
        useCase: 'writing'
      }
    ]
    const summary = runAudit(input)
    expect(summary.totalMonthlySavings).toBeGreaterThan(0)
    expect(summary.totalAnnualSavings).toBe(summary.totalMonthlySavings * 12)
  })

})

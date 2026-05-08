import Groq from 'groq-sdk'
import { NextRequest, NextResponse } from 'next/server'

type AuditResult = {
  toolName: string
  currentPlanName: string
  currentMonthlySpend: number
  recommendedAction: string
  monthlySavings: number
  severity: string
  reason: string
}

type SummaryRequest = {
  auditResults: AuditResult[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  useCase: string
  teamSize: string
}

export async function POST(req: NextRequest) {
  try {
    const body: SummaryRequest = await req.json()
    const {
      auditResults,
      totalMonthlySavings,
      totalAnnualSavings,
      useCase,
      teamSize,
    } = body

    // PART 1 — Find top saving
    const topSaving = auditResults.reduce((prev, current) =>
      prev.monthlySavings > current.monthlySavings ? prev : current
    )

    // Build the prompt
    const prompt = `You are a concise financial advisor for startups.
Write a 100-word personalized audit summary for a ${useCase} team of size ${teamSize}.

Their AI tools audit shows:
- Total monthly savings opportunity: $${totalMonthlySavings}
- Total annual savings opportunity: $${totalAnnualSavings}
- Tools audited: ${auditResults.map((r) => r.toolName).join(', ')}
- Top saving opportunity: ${topSaving.toolName} → ${topSaving.recommendedAction} saves $${topSaving.monthlySavings}/mo

Write in second person (you/your). Be specific about their tools and numbers. End with one actionable sentence.
Keep it under 100 words. No bullet points, just a paragraph.`

    // PART 2 — CALL GROQ API
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not set')
    }

    const client = new Groq({ apiKey })

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    try {
      const completion = await client.chat.completions.create(
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        },
        { signal: controller.signal }
      )

      clearTimeout(timeout)
      const generatedText = completion.choices[0]?.message?.content || ''

      return NextResponse.json(
        {
          summary: generatedText,
          isAI: true,
        },
        { status: 200 }
      )
    } catch (err) {
      console.error('Groq API Error or Timeout:', err)
      // Fallback in case of API failure
      return NextResponse.json(
        {
          summary: `Your AI stack audit reveals $${totalMonthlySavings} in potential monthly savings across ${auditResults.length} tools. Your biggest opportunity is ${topSaving.toolName} where ${topSaving.recommendedAction}. Switching or downgrading these tools could save your team $${totalAnnualSavings} annually without impacting productivity.`,
          isAI: false,
        },
        { status: 200 }
      )
    }
  } catch (error) {
    console.error('Request Processing Error:', error)
    return NextResponse.json(
      {
        summary: 'Unable to generate summary at this time.',
        isAI: false,
      },
      { status: 200 }
    )
  }
}

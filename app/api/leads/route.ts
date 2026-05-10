import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'
import { nanoid } from 'nanoid'

type AuditResult = {
  toolName: string
  currentMonthlySpend: number
  recommendedAction: string
  monthlySavings: number
  severity: string
  reason: string
}

type LeadRequestBody = {
  email: string
  companyName?: string
  role?: string
  honeypot?: string
  auditData: {
    results: AuditResult[]
    totalMonthlySavings: number
    totalAnnualSavings: number
  }
  useCase?: string
  teamSize?: string
}

// Simple rate limiting map (persists in memory per server instance)
const rateLimitMap = new Map<string, number[]>()

export async function POST(request: NextRequest) {
  try {
    const body: LeadRequestBody = await request.json()
    const {
      email,
      companyName,
      role,
      honeypot,
      auditData,
      useCase,
      teamSize,
    } = body

    // PART 1 — ABUSE PROTECTION
    if (honeypot) {
      console.log('Bot detected via honeypot')
      return NextResponse.json({ success: true, slug: 'fake' })
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    const now = Date.now()
    const hourAgo = now - 60 * 60 * 1000
    const requests = rateLimitMap.get(ip) || []
    const recentRequests = requests.filter((t) => t > hourAgo)

    if (recentRequests.length >= 3) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in an hour.' },
        { status: 429 }
      )
    }
    rateLimitMap.set(ip, [...recentRequests, now])

    // PART 2 — GENERATE SLUG
    const slug = nanoid(8)

    // PART 3 — SAVE TO SUPABASE
    // Save to audits table
    const { error: auditError } = await supabase.from('audits').insert({
      slug,
      tools_data: auditData.results,
      savings_data: {
        totalMonthlySavings: auditData.totalMonthlySavings,
        totalAnnualSavings: auditData.totalAnnualSavings,
      },
      use_case: useCase || 'unknown',
      team_size: teamSize || 'unknown',
    })

    if (auditError) {
      console.error('Supabase Audit Error:', auditError)
      throw new Error('Failed to save audit data')
    }

    // Save to leads table
    const { error: leadError } = await supabase.from('leads').insert({
      email,
      company_name: companyName,
      role,
      team_size: teamSize,
      audit_slug: slug,
      total_monthly_savings: auditData.totalMonthlySavings,
    })

    if (leadError) {
      console.error('Supabase Lead Error:', leadError)
      throw new Error('Failed to save lead data')
    }

    // PART 4 — SEND EMAIL via Resend
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      const resend = new Resend(resendApiKey)
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

      const top3 = auditData.results
        .filter((r) => r.monthlySavings > 0)
        .sort((a, b) => b.monthlySavings - a.monthlySavings)
        .slice(0, 3)

      try {
        await resend.emails.send({
          from: 'SpendLens <onboarding@resend.dev>',
          to: email,
          subject: 'Your AI Spend Audit Results — SpendLens',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
              <h1 style="color: #10b981;">Your AI Spend Audit</h1>
              <p>Hi there! Here are your audit results:</p>
              <h2 style="color: #1e293b;">
                Total Monthly Savings: $${auditData.totalMonthlySavings.toLocaleString()}
              </h2>
              <p>Annual savings potential: 
                <strong>$${auditData.totalAnnualSavings.toLocaleString()}</strong>
              </p>
              <h3>Top Recommendations:</h3>
              ${top3
              .map(
                (r) => `
                <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #10b981;">
                  <strong>${r.toolName}</strong><br/>
                  ${r.recommendedAction}<br/>
                  <span style="color: #10b981;">
                    Saves $${r.monthlySavings.toLocaleString()}/month
                  </span><br/>
                  <small style="color: #64748b;">${r.reason}</small>
                </div>
              `
              )
              .join('')}
              ${auditData.totalMonthlySavings > 500
              ? `
                <div style="background: #ecfdf5; padding: 16px; border-radius: 8px; margin-top: 24px;">
                  <strong>🚀 You qualify for a Credex consultation!</strong>
                  <p>Your savings potential is significant. A Credex advisor will reach out shortly to help you capture these savings through discounted AI credits.</p>
                  <a href="https://credex.rocks" style="color: #10b981; font-weight: bold;">Learn more about Credex →</a>
                </div>
              `
              : ''
            }
              <p style="margin-top: 24px; color: #64748b;">
                View your full audit at:<br/>
                <a href="${appUrl}/audit/${slug}" style="color: #10b981;">
                  ${appUrl}/audit/${slug}
                </a>
              </p>
              <hr style="margin-top: 32px; border-color: #e2e8f0;"/>
              <p style="color: #94a3b8; font-size: 12px;">
                SpendLens by Credex — Free AI Spend Auditor
              </p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
      }
    }

    // PART 5 — RETURN RESPONSE
    return NextResponse.json({
      success: true,
      slug,
    })
  } catch (error) {
    console.error('API /leads error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}

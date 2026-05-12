'use client'

import { AuditSummary } from '@/lib/auditEngine'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import EmailCapture from '@/components/EmailCapture'

export default function AuditPage() {
  const router = useRouter()
  const [summary, setSummary] = useState<AuditSummary | null>(null)
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [shareSlug, setShareSlug] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const savedAudit = localStorage.getItem('spendlens-audit')
      const savedInputs = localStorage.getItem('spendlens-inputs')
      const savedForm = localStorage.getItem('spendlens-form')

      if (!savedAudit || !savedInputs) {
        router.push('/')
        return
      }

      try {
        const parsedAudit = JSON.parse(savedAudit)
        const parsedInputs = JSON.parse(savedInputs)
        const parsedForm = savedForm ? JSON.parse(savedForm) : null

        const inputsMeta = Array.isArray(parsedInputs) ? parsedInputs[0] : parsedInputs

        setSummary(parsedAudit)
        setIsLoaded(true)

        // Fetch AI Summary
        const response = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            auditResults: parsedAudit.results,
            totalMonthlySavings: parsedAudit.totalMonthlySavings,
            totalAnnualSavings: parsedAudit.totalAnnualSavings,
            useCase: inputsMeta?.useCase || 'mixed',
            teamSize: parsedForm?.teamSize || 'unknown',
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setAiSummary(data.summary)
        }
        setIsAiLoading(false)
      } catch {
        console.error('Failed to parse or fetch audit data')
        setIsAiLoading(false)
      }
    }
    loadData()
  }, [router])

  if (!isLoaded || !summary) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500" />
      </div>
    )
  }

  const hasSavings = summary.totalMonthlySavings > 0
  const optimizedCount = summary.results.filter(r => r.severity === 'optimal').length
  const totalCount = summary.results.length
  const percentage = Math.round((optimizedCount / totalCount) * 100)

  return (
    <div className="min-h-screen text-white selection:bg-fuchsia-500/30 bg-transparent relative overflow-hidden">
      <main className="p-6 md:p-12 max-w-4xl mx-auto space-y-12 animate-fade-in relative z-10">
        {/* Success Banner */}
        {shareSlug && (
          <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4 text-center mb-6 animate-fade-in">
            <p className="text-violet-300 font-medium">
              Report sent! Share your audit:
            </p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  window.location.origin + '/audit/' + shareSlug
                )
                alert('Link copied!')
              }}
              className="text-violet-300 underline text-sm mt-1 hover:text-violet-200 transition-colors"
            >
              {window.location.origin}/audit/{shareSlug}
            </button>
          </div>
        )}

        {/* Header/Hero */}
        <div className="text-center space-y-4 py-8">
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-10">
            <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
              <div
                className="bg-violet-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: percentage + '%' }}
              />
            </div>
            <p className="text-purple-300/60 text-xs uppercase tracking-widest text-center mb-8">
              {optimizedCount} of {totalCount} tools already optimized ({percentage}%)
            </p>
          </div>

          {hasSavings ? (
            <>
              <h1 className="text-purple-200 text-xl font-medium uppercase tracking-widest mb-2">You could save</h1>
              <div className="text-6xl md:text-8xl font-black text-white drop-shadow-lg">
                ${summary.totalMonthlySavings.toLocaleString()}/mo
              </div>
              <p className="text-purple-200/80 text-lg mt-3">
                That&apos;s <span className="text-white font-bold">${summary.totalAnnualSavings.toLocaleString()} per year</span> back in your pocket.
              </p>

              {summary.totalMonthlySavings > 500 && (
                <a
                  href="https://credex.rocks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-8 bg-gradient-to-r from-purple-900/60 to-violet-900/60 border border-purple-600/40 hover:from-purple-800/60 hover:to-violet-800/60 transition-colors text-white p-6 rounded-xl text-center font-bold"
                >
                  Credex can help you save even more — book a free consultation →
                </a>
              )}
            </>
          ) : (
            <>
              <div className="inline-block p-3 bg-violet-500/10 rounded-2xl mb-4">
                <svg className="w-12 h-12 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-4xl font-black text-white">You&apos;re spending well</h1>
              <p className="text-slate-400 max-w-md mx-auto">
                Your current AI stack looks optimized. We&apos;ll notify you when new savings apply to your toolset.
              </p>
            </>
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
            <div className="bg-[#1a1135] border border-purple-800/40 rounded-xl p-5 text-center">
              <p className="text-purple-300/60 text-xs uppercase tracking-widest mb-1">Tools Audited</p>
              <p className="text-white font-black text-2xl">{totalCount}</p>
            </div>
            <div className="bg-[#1a1135] border border-purple-800/40 rounded-xl p-5 text-center">
              <p className="text-purple-300/60 text-xs uppercase tracking-widest mb-1">Monthly Savings</p>
              <p className="text-violet-300 font-black text-2xl">${summary.totalMonthlySavings.toLocaleString()}</p>
            </div>
            <div className="bg-[#1a1135] border border-purple-800/40 rounded-xl p-5 text-center">
              <p className="text-purple-300/60 text-xs uppercase tracking-widest mb-1">Annual Savings</p>
              <p className="text-violet-300 font-black text-2xl">${summary.totalAnnualSavings.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* AI Summary Card */}
        <section className="bg-[#1a1135] border-l-4 border-l-purple-500 rounded-xl p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="text-white font-bold text-xl">
              Your Personalized Audit Summary
            </h2>
          </div>

          {isAiLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-slate-800 rounded w-full" />
              <div className="h-4 bg-slate-800 rounded w-5/6" />
              <div className="h-4 bg-slate-800 rounded w-4/6" />
            </div>
          ) : aiSummary ? (
            <div className="space-y-4">
              {aiSummary.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-slate-300 leading-relaxed text-sm">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm italic">
              Unable to generate AI summary. See your breakdown below.
            </p>
          )}
        </section>

        {/* Breakdown List */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold px-2">Your Tool-by-Tool Breakdown</h2>
          <div className="space-y-4">
            {summary.results.map((result) => (
              <div
                key={result.toolId}
                className="bg-[#1a1135]/80 border border-purple-800/30 rounded-xl p-6 shadow-sm hover:border-purple-600/50 transition-colors"
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-white font-bold text-xl">{result.toolName}</h3>
                  <span
                    className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${result.severity === 'high'
                      ? 'bg-red-900/30 text-red-300 border border-red-700/40'
                      : result.severity === 'medium'
                        ? 'bg-orange-900/30 text-orange-300 border border-orange-700/40'
                        : 'bg-violet-900/30 text-violet-300 border border-violet-700/40'
                      }`}
                  >
                    {result.severity === 'high'
                      ? 'High Savings'
                      : result.severity === 'medium'
                        ? 'Some Savings'
                        : 'Optimized ✓'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div>
                    <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Current Spend</p>
                    <p className="text-white text-lg font-medium">${result.currentMonthlySpend}/mo</p>
                    <p className="text-slate-400 text-xs italic">{result.currentPlanName}</p>
                  </div>

                  <div className="flex justify-center">
                    <div className="bg-slate-800 p-2 rounded-full hidden md:block">
                      <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                    <div className="md:hidden border-t border-slate-800 w-full my-2"></div>
                  </div>

                  <div className="md:text-right">
                    <p className="text-violet-300 text-xs uppercase font-bold tracking-wider mb-1">Recommended</p>
                    {result.severity === 'optimal' ? (
                      <p className="text-violet-300 font-bold">Stay on current plan</p>
                    ) : (
                      <>
                        <p className="text-white text-lg font-bold">
                          {result.recommendedAction}
                        </p>
                        <p className="text-violet-300 font-bold text-sm">
                          ${result.monthlySavings} saved/mo
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/50">
                  <p className="text-slate-400 italic text-sm leading-relaxed">
                    &quot;{result.reason}&quot;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 pt-8 pb-20">
          <button
            onClick={() => setShowEmailModal(true)}
            className="flex-1 border border-purple-500 text-purple-300 hover:bg-purple-900/30 rounded-xl py-3 px-6 font-bold transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Export my audit
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-[#1a1135] hover:bg-[#251849] text-white border border-purple-800/40 rounded-xl py-3 px-6 font-bold transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Re-audit my stack
          </button>
        </div>

      </main>

      {/* Modals */}
      <EmailCapture
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        totalMonthlySavings={summary?.totalMonthlySavings || 0}
        onSuccess={(slug) => {
          setShareSlug(slug)
          setShowEmailModal(false)
        }}
      />
    </div>
  )
}

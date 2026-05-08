'use client'

import { AuditSummary, AuditResult } from '@/lib/auditEngine'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuditPage() {
  const router = useRouter()
  const [summary, setSummary] = useState<AuditSummary | null>(null)
  const [aiSummary, setAiSummary] = useState<string | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState(false)

  useEffect(() => {
    const savedAudit = localStorage.getItem('spendlens-audit')
    const savedInputs = localStorage.getItem('spendlens-inputs')

    if (!savedAudit || !savedInputs) {
      router.push('/')
      return
    }

    try {
      const parsedAudit = JSON.parse(savedAudit)
      setSummary(parsedAudit)
      setIsLoaded(true)

      // Fetch AI Summary
      fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audit: parsedAudit, inputs: JSON.parse(savedInputs) }),
      })
        .then((res) => res.json())
        .then((data) => {
          setAiSummary(data.summary)
          setIsAiLoading(false)
        })
        .catch((err) => {
          console.error('AI summary fetch failed:', err)
          setIsAiLoading(false)
        })
    } catch (e) {
      console.error('Failed to parse audit data')
      router.push('/')
    }
  }, [router])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopyFeedback(true)
    setTimeout(() => setCopyFeedback(false), 2000)
  }

  if (!isLoaded || !summary) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400" />
      </div>
    )
  }

  const hasSavings = summary.totalMonthlySavings > 0

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30">
      <main className="p-6 md:p-12 max-w-4xl mx-auto space-y-12">
        {/* Header/Hero */}
        <div className="text-center space-y-4 py-8">
          {hasSavings ? (
            <>
              <h1 className="text-2xl font-bold text-slate-300">You could save</h1>
              <div className="text-emerald-400 text-6xl md:text-8xl font-black tracking-tighter">
                ${summary.totalMonthlySavings.toLocaleString()}/mo
              </div>
              <p className="text-xl text-slate-400">
                That's <span className="text-white font-bold">${summary.totalAnnualSavings.toLocaleString()} per year</span> back in your pocket.
              </p>

              {summary.totalMonthlySavings > 500 && (
                <a
                  href="https://credex.rocks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-8 bg-emerald-500 hover:bg-emerald-400 transition-colors text-black p-4 rounded-xl text-center font-bold"
                >
                  Credex can help you save even more — book a free consultation →
                </a>
              )}
            </>
          ) : (
            <>
              <div className="inline-block p-3 bg-emerald-500/10 rounded-2xl mb-4">
                <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-4xl font-black text-white">You're spending well</h1>
              <p className="text-slate-400 max-w-md mx-auto">
                Your current AI stack looks optimized. We'll notify you when new savings apply to your toolset.
              </p>
            </>
          )}
        </div>

        {/* AI Summary Card */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="text-emerald-400">✨</span> Your Personalized Audit Summary
          </h2>
          {isAiLoading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-slate-800 rounded w-full" />
              <div className="h-4 bg-slate-800 rounded w-5/6" />
              <div className="h-4 bg-slate-800 rounded w-4/6" />
            </div>
          ) : aiSummary ? (
            <p className="text-slate-300 leading-relaxed italic">{aiSummary}</p>
          ) : (
            <p className="text-slate-500 text-sm italic">
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
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-colors"
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-white font-bold text-xl">{result.toolName}</h3>
                  <span
                    className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                      result.severity === 'high'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : result.severity === 'medium'
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
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
                    <p className="text-emerald-400 text-xs uppercase font-bold tracking-wider mb-1">Recommended</p>
                    {result.severity === 'optimal' ? (
                      <p className="text-emerald-400 font-bold">Stay on current plan</p>
                    ) : (
                      <>
                        <p className="text-white text-lg font-bold">
                          {result.recommendedAction}
                        </p>
                        <p className="text-emerald-400 font-bold text-sm">
                          ${result.monthlySavings} saved/mo
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/50">
                  <p className="text-slate-400 italic text-sm leading-relaxed">
                    "{result.reason}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 pt-8">
          <button
            onClick={handleShare}
            className="flex-1 border border-emerald-400/50 hover:bg-emerald-400/10 text-emerald-400 rounded-xl py-4 px-6 font-bold transition-all flex items-center justify-center gap-2"
          >
            {copyFeedback ? (
              'Link copied! ✓'
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Share this audit
              </>
            )}
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 rounded-xl py-4 px-6 font-bold transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Re-audit my stack
          </button>
        </div>
      </main>
    </div>
  )
}

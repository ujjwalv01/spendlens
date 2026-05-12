'use client'

import { useState } from 'react'

type EmailCaptureProps = {
  isOpen: boolean
  onClose: () => void
  totalMonthlySavings: number
  onSuccess: (slug: string) => void
}

export default function EmailCapture({
  isOpen,
  onClose,
  totalMonthlySavings,
  onSuccess,
}: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Honeypot check
    if (honeypot) {
      // Silently pretend it worked
      onSuccess('mock-slug-' + Math.random().toString(36).substring(7))
      return
    }

    if (!email) {
      setError('Please enter your work email.')
      return
    }

    setIsLoading(true)

    try {
      const savedAudit = localStorage.getItem('spendlens-audit')
      const auditData = savedAudit ? JSON.parse(savedAudit) : null

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          companyName,
          role,
          honeypot,
          auditData,
          totalSavings: auditData?.totalMonthlySavings || totalMonthlySavings,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save lead. Please try again.')
      }

      const data = await response.json()
      onSuccess(data.slug)
    } catch (err) {
      console.error('Lead submission error:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1a1135] border border-purple-700/50 rounded-2xl p-8 max-w-md w-full relative shadow-2xl shadow-purple-900/40 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors text-xl p-2"
        >
          ✕
        </button>

        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-purple-500/10 rounded-xl mb-4">
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Get your full report 📊</h2>
          <p className="text-slate-400 text-sm">
            Save your audit results and get personalized savings tips delivered to your inbox.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-2 block">
              Work Email
            </label>
            <input
              required
              type="email"
              placeholder="you@company.com"
              className="bg-[#0d0a1a] border border-purple-800/50 rounded-lg p-3 text-white w-full focus:border-purple-500 focus:outline-none transition-all placeholder:text-slate-500 focus:ring-1 focus:ring-purple-500/30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-2 block">
              Company Name (optional)
            </label>
            <input
              type="text"
              placeholder="Acme Inc."
              className="bg-[#0d0a1a] border border-purple-800/50 rounded-lg p-3 text-white w-full focus:border-purple-500 focus:outline-none transition-all placeholder:text-slate-500 focus:ring-1 focus:ring-purple-500/30"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="text-slate-300 text-xs font-bold uppercase tracking-wider mb-2 block">
              Your Role (optional)
            </label>
            <div className="relative">
              <select
                className="bg-[#0d0a1a] border border-purple-800/50 rounded-lg p-3 text-white w-full focus:border-purple-500 focus:outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-purple-500/30"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select your role</option>
                <option value="founder">Founder / Co-founder</option>
                <option value="engineering-manager">Engineering Manager</option>
                <option value="developer">Developer</option>
                <option value="other">Other</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Honeypot */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white font-bold w-full py-3 rounded-xl shadow-lg shadow-purple-900/50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></span>
                  Saving...
                </>
              ) : totalMonthlySavings > 500 ? (
                'Email me the report + book Credex consultation'
              ) : (
                'Email me the report →'
              )}
            </button>

            {error && (
              <p className="text-red-400 text-xs mt-3 text-center animate-pulse">
                {error}
              </p>
            )}

            <p className="text-slate-500 text-[10px] text-center mt-4 uppercase tracking-widest font-medium">
              No spam. Credex may reach out for high-savings audits.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import SpendForm from '@/components/SpendForm'
export default function Home() {
  return (
    <div className="min-h-screen text-white selection:bg-fuchsia-500/30 bg-transparent relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse at center, 
            transparent 40%, 
            rgba(8, 6, 18, 0.8) 100%)`
        }} />
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-sm border-b border-purple-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white font-black text-xl">
              SpendLens
            </span>
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <a href="#" className="text-white/80 hover:text-white transition-colors">Pricing Data</a>
            <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors">How It Works</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main role="main" className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Header Area */}
          <div className="space-y-6 relative">
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1] relative">
              Find Out If You&apos;re <br />
              <span className="bg-gradient-to-r from-violet-300 to-purple-200 bg-clip-text text-transparent">
                Overpaying
              </span> for AI Tools
            </h1>
            <p className="text-lg text-purple-100/90 max-w-2xl mx-auto leading-relaxed relative">
              Free audit in 2 minutes. No signup required. <br />
              <span className="text-white font-semibold">Used by 500+ startups</span> to optimize their AI stack.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 mb-16">
            <button
              onClick={() => document.getElementById('audit-form')
                ?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold py-4 px-12 rounded-2xl text-lg shadow-lg shadow-purple-900/50 transition-all duration-200 hover:scale-105"
            >
              Audit My AI Spend - It&apos;s Free
            </button>
            <p className="text-purple-300/80 text-sm">
              No signup required · Takes 2 minutes
            </p>
          </div>
          <section id="how-it-works" className="max-w-5xl mx-auto px-6 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-white uppercase tracking-wider mb-3">
                How It Works
              </h2>
              <p className="text-purple-300/60">
                Three steps from overpaying to optimized
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1a1135]/60 border border-purple-800/30 rounded-2xl p-6 relative hover:border-purple-600/50 transition-all duration-300 group">
                <span className="absolute top-4 right-4 text-6xl font-black text-purple-900/40">01</span>
                <div className="bg-purple-900/50 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg uppercase tracking-wide mb-2">
                  Enter Your Stack
                </h3>
                <p className="text-purple-300/60 text-sm leading-relaxed">
                  Select which AI tools you pay for — Cursor, Claude, ChatGPT, Copilot and more. Enter your plan and monthly spend.
                </p>
              </div>

              <div className="bg-[#1a1135]/60 border border-purple-800/30 rounded-2xl p-6 relative hover:border-purple-600/50 transition-all duration-300 group">
                <span className="absolute top-4 right-4 text-6xl font-black text-purple-900/40">02</span>
                <div className="bg-purple-900/50 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg uppercase tracking-wide mb-2">
                  Get Instant Audit
                </h3>
                <p className="text-purple-300/60 text-sm leading-relaxed">
                  Our engine compares your spend against current pricing, detects wrong plans, and surfaces cheaper alternatives instantly.
                </p>
              </div>

              <div className="bg-[#1a1135]/60 border border-purple-800/30 rounded-2xl p-6 relative hover:border-purple-600/50 transition-all duration-300 group">
                <span className="absolute top-4 right-4 text-6xl font-black text-purple-900/40">03</span>
                <div className="bg-purple-900/50 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-lg uppercase tracking-wide mb-2">
                  Save and Share
                </h3>
                <p className="text-purple-300/60 text-sm leading-relaxed">
                  Get your savings report emailed to you. Share your unique audit URL with your team or on social media.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                'Instant Results',
                'No Login Required', 
                'Verified Pricing Data',
                'Always Free',
              ].map((feature) => (
                <div key={feature} className="bg-purple-900/20 border border-purple-800/30 rounded-xl p-4 flex items-center justify-center">
                  <span className="text-purple-200/80 text-sm font-medium text-center">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Audit Container */}
          <div id="audit-form" className="mt-16 relative mx-auto max-w-3xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500/20 to-purple-400/20 blur-2xl rounded-3xl opacity-50 -z-10" />
            <div className="bg-[#1a1135]/80 backdrop-blur-sm border border-purple-800/40 rounded-2xl p-8 shadow-2xl shadow-purple-900/20 text-left relative">
              <SpendForm />
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 py-12 text-center">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} SpendLens. Save on your AI compute and licenses.
        </p>
      </footer>
    </div>
  )
}

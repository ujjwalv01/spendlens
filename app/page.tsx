import SpendForm from '@/components/SpendForm'

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              SpendLens
            </span>

          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-emerald-400 transition-colors">Pricing Data</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">About</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Header Area */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Find Out If You&apos;re <br />
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">
                Overpaying
              </span> for AI Tools
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Free audit in 2 minutes. No signup required. <br />
              <span className="text-emerald-400 font-semibold">Used by 500+ startups</span> to optimize their AI stack.
            </p>
          </div>

          {/* Social Proof Badges */}
          <div className="flex flex-wrap justify-center gap-3 text-xs md:text-sm font-semibold">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-full text-slate-300 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Free Tool
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-full text-slate-300 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              No Login Required
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-full text-slate-300 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Instant Results
            </div>
          </div>

          {/* Audit Container */}
          <div className="mt-16 relative mx-auto max-w-3xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 blur-2xl rounded-3xl opacity-50 -z-10" />
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 md:p-10 text-left">
              <SpendForm />
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-800/50 py-12 text-center">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} SpendLens. Save on your AI compute and licenses.
        </p>
      </footer>
    </div>
  )
}

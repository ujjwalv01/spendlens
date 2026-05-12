import SpendForm from '@/components/SpendForm'

export default function Home() {
  return (
    <div className="min-h-screen text-white selection:bg-fuchsia-500/30 bg-transparent relative overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-transparent backdrop-blur-sm border-b border-purple-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-purple-300 font-black text-xl">
              SpendLens
            </span>

          </div>
          <div className="flex gap-6 text-sm font-medium">
            <a href="#" className="text-purple-300/70 hover:text-purple-200">Pricing Data</a>
            <a href="#" className="text-purple-300/70 hover:text-purple-200">About</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-4">
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



          {/* Audit Container */}
          <div className="mt-16 relative mx-auto max-w-3xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500/20 to-purple-400/20 blur-2xl rounded-3xl opacity-50 -z-10" />
            <div className="bg-[#1a1135]/80 backdrop-blur-sm border border-purple-800/40 rounded-2xl p-8 shadow-2xl shadow-purple-900/20 text-left relative">
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

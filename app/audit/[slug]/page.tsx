import { supabase, AuditRecord } from '@/lib/supabase'
import { Metadata } from 'next'
import Link from 'next/link'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data: audit } = await supabase
    .from('audits')
    .select('savings_data')
    .eq('slug', slug)
    .single()

  const savings = (audit?.savings_data as any) || {}
  const monthly = savings?.totalMonthlySavings || 0
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://spendlens.vercel.app'

  return {
    title: `AI Spend Audit — $${monthly.toLocaleString()}/mo savings found`,
    description: `This team could save $${monthly.toLocaleString()}/month on AI tools. Run your free audit on SpendLens.`,
    openGraph: {
      title: `I found $${monthly.toLocaleString()}/mo in AI tool savings 💸`,
      description: `Free AI spend auditor for startups. See where you're overpaying on Cursor, Claude, ChatGPT and more.`,
      url: `${appUrl}/audit/${slug}`,
      siteName: 'SpendLens',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `I found $${monthly.toLocaleString()}/mo in AI tool savings 💸`,
      description: 'Run your free AI spend audit on SpendLens',
    },
  }
}

export default async function SharedAuditPage({ params }: Props) {
  const { slug } = await params
  const { data: audit, error } = (await supabase
    .from('audits')
    .select('*')
    .eq('slug', slug)
    .single()) as { data: AuditRecord | null; error: any }

  if (error || !audit) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-6xl font-black text-white mb-6">404</h1>
          <p className="text-slate-400 text-xl mb-8">
            Audit not found or has expired.
          </p>
          <Link
            href="/"
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-8 rounded-xl transition-all inline-block"
          >
            Run your own free audit →
          </Link>
        </div>
      </div>
    )
  }

  const savings = (audit.savings_data as any) || {}
  const tools = (audit.tools_data as any[]) || []
  const hasSavings = savings.totalMonthlySavings > 0

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30">
      <main className="p-6 md:p-12 max-w-4xl mx-auto space-y-16">
        {/* Public Hero */}
        <div className="text-center space-y-6 py-12">
          <Link href="/" className="inline-block mb-8">
            <span className="text-2xl font-black tracking-tighter">
              Spend<span className="text-emerald-400">Lens</span>
            </span>
          </Link>

          {hasSavings ? (
            <>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                This team could save <br />
                <span className="text-emerald-400 text-6xl md:text-7xl">
                  ${savings.totalMonthlySavings.toLocaleString()}/mo
                </span>
              </h1>
              <p className="text-xl text-slate-400">
                That&apos;s a total annual savings of{' '}
                <span className="text-white font-bold">
                  ${savings.totalAnnualSavings.toLocaleString()}
                </span>
              </p>
            </>
          ) : (
            <h1 className="text-4xl md:text-5xl font-black text-white">
              This AI stack is <br />
              <span className="text-emerald-400">already optimized ✓</span>
            </h1>
          )}

          <div className="pt-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl inline-block max-w-lg w-full">
              <h2 className="text-white font-bold text-xl mb-2">
                Want to see YOUR savings?
              </h2>
              <p className="text-slate-400 text-sm mb-6">
                Audit your company&apos;s AI spend in 2 minutes. No login required.
              </p>
              <Link
                href="/"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 px-10 rounded-xl transition-all inline-block w-full text-lg shadow-lg shadow-emerald-500/20"
              >
                Run my free audit →
              </Link>
            </div>
          </div>
        </div>

        {/* Tools breakdown */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold px-2 text-slate-300">
            Audit Breakdown
          </h2>
          <div className="space-y-4">
            {tools.map((result, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm"
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-white font-bold text-xl">
                    {result.toolName}
                  </h3>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div>
                    <p className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">
                      Recommendation
                    </p>
                    <p className="text-white text-lg font-bold">
                      {result.recommendedAction}
                    </p>
                    <p className="text-slate-400 italic text-sm mt-2">
                      &quot;{result.reason}&quot;
                    </p>
                  </div>

                  <div className="md:text-right">
                    <p className="text-emerald-400 text-xs uppercase font-bold tracking-wider mb-1">
                      Monthly Savings
                    </p>
                    <p className="text-emerald-400 text-3xl font-black">
                      ${result.monthlySavings.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <footer className="text-center pt-12 pb-20 border-t border-slate-800">
          <Link href="/" className="group inline-block">
            <p className="text-slate-500 text-sm mb-2 group-hover:text-slate-400 transition-colors">
              Built by <span className="font-bold">SpendLens</span>
            </p>
            <p className="text-slate-600 text-xs font-medium uppercase tracking-widest">
              Free AI Spend Auditor for Startups
            </p>
          </Link>
        </footer>
      </main>
    </div>
  )
}

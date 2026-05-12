import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SpendLens — Free AI Spend Auditor for Startups',
  description: 'Find out if you are overpaying for AI tools. Free audit in 2 minutes. No signup required. Supports Cursor, Claude, ChatGPT, GitHub Copilot and more.',
  keywords: 'AI tools, spend audit, Cursor pricing, Claude pricing, ChatGPT cost, startup tools',
  openGraph: {
    title: 'SpendLens — Free AI Spend Auditor',
    description: 'Find out if you are overpaying for AI tools in 2 minutes.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpendLens — Free AI Spend Auditor',
    description: 'Find out if you are overpaying for AI tools in 2 minutes.',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col`}>{children}</body>
    </html>
  )
}

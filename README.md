# SpendLens — Free AI Spend Auditor for Startups

> Find out if you are overpaying for AI tools. 
> Free audit in 2 minutes. No signup required.

SpendLens is a free web app that audits your AI tool spending — Cursor, Claude, ChatGPT, GitHub Copilot, Gemini, Windsurf and more — and tells you exactly where you are overpaying and how much you could save.

Built for engineering managers and founders who see their monthly AI bill and have no benchmark.

## Screenshots
[Add 3 screenshot links here after taking them]

## Live Demo
[your vercel URL here]

## Quick Start

### Prerequisites
- Node.js 20+
- npm

### Install and run locally:
```bash
git clone https://github.com/ujjwalv01/spendlens
cd spendlens
npm install
```

Create `.env.local` with:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RESEND_API_KEY=
GROQ_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
npm run dev
```

Open http://localhost:3000

### Deploy to Vercel:
1. Push repo to GitHub
2. Import on vercel.com
3. Add all env variables in Vercel dashboard
4. Deploy

## Decisions

### 1. Hardcoded rules for audit logic instead of AI
The audit engine uses pure TypeScript logic not AI. A finance person reading the code should agree with every recommendation. AI-generated savings advice would be unpredictable and unverifiable. Hardcoded rules = defensible, testable, fast.

### 2. Groq instead of Anthropic API
Groq offers a free tier with llama-3.3-70b which is more than capable for 250-word summaries. Anthropic has no free tier. The assignment says "or any LLM" — Groq is the right call for a free tool with unknown traffic.

### 3. Email captured after results not before
Showing value before asking for contact details is the core UX principle here. Anyone who gates email before showing results loses 70%+ of users. We show the full audit first, then offer to email it.

### 4. Supabase over Firebase
Supabase is Postgres under the hood — structured data with proper types fits audit records better than Firebase's document model. Free tier is generous and the JS client is simple.

### 5. localStorage for audit state
The audit runs entirely client-side. Using localStorage means zero latency between form submit and results page. No API call needed for the core audit flow — only for AI summary and lead capture which are both async.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Postgres)
- Groq API (llama-3.3-70b)
- Resend (transactional email)
- Vercel (deployment)
- Jest (testing)
- GitHub Actions (CI)

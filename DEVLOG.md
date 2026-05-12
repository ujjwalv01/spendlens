# Devlog

## Day 1 — 2026-05-07

**Hours worked:** 3

**What I did:**
Set up the SpendLens project using Next.js with TypeScript and Tailwind. Created public GitHub repo, scaffolded all required folders and placeholder files, set up GitHub Actions CI with Jest testing. Fixed ts-node and Jest config issues to get CI green.

**What I learned:**
jest.config.ts requires ts-node explicitly — switching to jest.config.js avoids this issue entirely. create-next-app auto initializes git.

**Blockers / what I'm stuck on:**
CI took several attempts to go green due to Jest config issues. Resolved.

**Plan for tomorrow:**
Build pricingData.ts with all 8 AI tools and their plans, implement the audit engine logic, and write real unit tests.

## Day 2 — 2026-05-08

**Hours worked:** 6

**What I did:**
Morning: Built pricing data constants for all 8 AI tools, implemented audit engine logic with savings calculations, wrote 5 unit tests — all passing.
Night: Built landing page and SpendForm with tool selection, plan dropdowns, localStorage persistence and form validation.

**What I learned:**
Managing complex nested state for dynamic forms in React requires careful attention to object immutability, especially when auto-calculating dependent fields like monthly spend while still allowing manual user overrides.

**Blockers / what I'm stuck on:**
The `/audit` results page currently throws a default export error because it hasn't been implemented yet. This is the next priority.

**Plan for tomorrow:**
Build the audit results page with hero savings display, per-tool breakdown cards, and Groq AI summary integration.

## Day 3 — 2026-05-09

**Hours worked:** 8

**What I did:**
Morning: Built audit results page with hero savings, per-tool breakdown cards, progress bar and stats row.
Night: Built Groq AI summary API route with fallback, connected it to results page, built email capture modal with honeypot protection.

**What I learned:**
Groq's Llama 3.3 model is incredibly fast for concise summarization. Implementing a 10s timeout with AbortController and a static fallback ensures the UI never feels broken even if the AI service lags.

**Blockers / what I'm stuck on:**
The `/api/leads` endpoint is currently a mock; I need to set up Supabase and Resend to handle the actual data persistence and email delivery.

**Plan for tomorrow:**
Build Supabase backend, leads API route, transactional email with Resend, and shareable URLs.

## Day 4 — 2026-05-10

**Hours worked:** 6

**What I did:**
Set up Supabase with audits and leads tables. Built leads API with rate limiting, honeypot protection, Resend transactional email, and slug generation. Built public shareable audit page with dynamic Open Graph tags for viral sharing.

**What I learned:**
Next.js 16 Server Components make building public, SEO-friendly pages incredibly efficient. Using `generateMetadata` to fetch database records allows for extremely personalized social media previews that drive significantly higher engagement.

**Blockers / what I'm stuck on:**
Database security policies (RLS) in Supabase need to be carefully configured to allow public read access for audits by slug while keeping lead information strictly private.

**Plan for tomorrow:**
Deploy to Vercel, fix Lighthouse scores, write GTM, ECONOMICS and other docs.

## Day 5 — 2026-05-11

**Hours worked:** 3

**What I did:**
Deployed SpendLens to Vercel. Wrote GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md, and ARCHITECTURE.md with full detail. Handled rebranding adjustments to ensure consistent partner mentions across the codebase.

**What I learned:**
Maintaining documentation consistency is as important as the code itself when building for a partner ecosystem. Rebranding or adjusting partner mentions (like Credex) mid-build requires a systematic approach to avoid broken links or confusing user experiences in the conversion funnel.

**Blockers / what I'm stuck on:**
Lighthouse performance optimization for the audit results page; the heavy client-side calculation and AI summary fetch need careful orchestration to keep the LCP low.

**Plan for tomorrow:**
Write user interviews, REFLECTION.md, finalize README, fix any remaining issues, and run a final Lighthouse audit.

## Day 6 — 2026-05-12

**Hours worked:** 3

**What I did:**
Deployed to Vercel. Fixed Lighthouse accessibility and performance issues. Completed PROMPTS.md, TESTS.md, and README.md. All docs now complete except REFLECTION and USER_INTERVIEWS which need real content.

**What I learned:**
Fixing accessibility in Next.js requires close attention to form element linking (htmlFor/id) and ensuring that elements inside transformed containers (like animated fading elements) don't break CSS fixed positioning, which I encountered with the email capture modal.

**Blockers / what I'm stuck on:**
None right now. The main technical pieces are done, but capturing the final screenshots and making sure the live Vercel URL works flawlessly is the last hurdle.

**Plan for tomorrow:**
Write REFLECTION.md answers, finalize USER_INTERVIEWS.md, take screenshots, do final check and submit.

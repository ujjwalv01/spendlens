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

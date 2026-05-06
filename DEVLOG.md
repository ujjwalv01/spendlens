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

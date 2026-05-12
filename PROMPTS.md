# SpendLens AI Prompts & Configuration

This document tracks the AI prompts, reasoning, and models used throughout the SpendLens project.

## 1. Audit Summary Prompt (used in `/api/summary`)

### The Prompt:
```text
You are a concise financial advisor for startups.
Write a 200-250 word personalized audit summary for a ${useCase} team of size ${teamSize}.

Their AI tools audit shows:
- Total monthly savings opportunity: $${totalMonthlySavings}
- Total annual savings opportunity: $${totalAnnualSavings}
- Tools audited: ${auditResults.map((r) => r.toolName).join(', ')}
- Breakdown of recommendations:
${auditResults.map((r) => 
  `  * ${r.toolName}: ${r.recommendedAction} — saves $${r.monthlySavings}/mo. Reason: ${r.reason}`
).join('\n')}

Structure your response in 3 short paragraphs:
1. Overall assessment of their current AI spend and what the numbers mean for their team
2. Top 2-3 specific recommendations with exact dollar amounts and why each makes sense
3. What they should do first this week and projected annual impact if they act now

Write in second person (you/your). Be specific about their actual tools and real numbers. Sound like a trusted advisor not a robot. No bullet points — flowing paragraphs only. 200-250 words exactly. Separate each paragraph with a blank line. Do not use bullet points or headers.
```

### Why I wrote it this way:
- Second person (you/your) makes it feel personal
- Structured in 3 paragraphs keeps it scannable
- Explicit word count prevents rambling
- Including actual dollar amounts grounds it in reality
- Asking for paragraph format prevents bullet lists which feel robotic in this context

### What I tried that did not work:
- 100 word limit was too short — felt generic
- Asking for bullet points looked like a robot wrote it
- Not including the tool list made it too vague
- One big paragraph with no structure felt dense

### Model choice:
Used llama-3.3-70b-versatile via Groq API
- Free tier with generous limits
- Fast inference (< 2 seconds typically)
- Quality sufficient for 250 word summaries
- Fallback to template if API fails

## 2. AI Tools Used During Development

### Google Antigravity (primary):
Used for: All component generation, bug fixing, file creation, refactoring
What I trusted it with: UI components, boilerplate, CSS styling, TypeScript types
What I did NOT trust it with: Audit engine logic (verified manually), pricing data (verified against official pages), security-sensitive code (reviewed every line)

### One time the AI was wrong:
Antigravity generated audit engine code that returned negative savings in edge cases where monthlySpend was 0. It did not handle the zero-spend case. I caught this when writing unit tests — test 3 failed because savings came back as -15 instead of 0. Fixed by adding:
`if (savings <= 0) return optimal result.`

## 3. Fallback Template (when Groq API fails)

The fallback summary template used when API is down:
"Your AI stack audit reveals $X in potential monthly savings across N tools. Your biggest opportunity is [tool] where [action]. Switching or downgrading these tools could save your team $Y annually without impacting productivity."

Why template not empty state:
Users should always see something useful even if the AI call fails. A blank section would feel broken.

export type Plan = {
  planId: string
  planName: string
  pricePerUserPerMonth: number
  minSeats: number
  maxSeats: number | null
  bestFor: string
}

export type Tool = {
  toolId: string
  toolName: string
  category: 'coding' | 'writing' | 'general' | 'api'
  plans: Plan[]
}

export type AuditInput = {
  toolId: string
  planId: string
  seats: number
  monthlySpend: number
  useCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed'
}

export const TOOLS: Tool[] = [
  {
    toolId: 'cursor',
    toolName: 'Cursor',
    category: 'coding',
    plans: [
      {
        planId: 'hobby',
        planName: 'Hobby',
        pricePerUserPerMonth: 0,
        minSeats: 1,
        maxSeats: null,
        bestFor: 'Hobbyists and students',
      },
      {
        planId: 'pro',
        planName: 'Pro',
        pricePerUserPerMonth: 20,
        minSeats: 1,
        maxSeats: null,
        bestFor: 'Individual developers',
      },
      {
        planId: 'pro-plus',
        planName: 'Pro+',
        pricePerUserPerMonth: 60,
        minSeats: 1,
        maxSeats: null,
        bestFor: 'Heavy users needing more credits',
      },
      {
        planId: 'ultra',
        planName: 'Ultra',
        pricePerUserPerMonth: 200,
        minSeats: 1,
        maxSeats: null,
        bestFor: 'Power users with max usage needs',
      },
      {
        planId: 'teams',
        planName: 'Teams',
        pricePerUserPerMonth: 40,
        minSeats: 2,
        maxSeats: null,
        bestFor: 'Engineering teams needing admin controls',
      },
    ],
  },
  {
    toolId: 'github-copilot',
    toolName: 'GitHub Copilot',
    category: 'coding',
    plans: [
      {
        planId: 'free',
        planName: 'Free',
        pricePerUserPerMonth: 0,
        minSeats: 1,
        maxSeats: 1,
        bestFor: 'Trying out AI coding assistance',
      },
      {
        planId: 'pro',
        planName: 'Pro',
        pricePerUserPerMonth: 10,
        minSeats: 1,
        maxSeats: 1,
        bestFor: 'Individual developers needing unlimited completions',
      },
      {
        planId: 'pro-plus',
        planName: 'Pro+',
        pricePerUserPerMonth: 19,
        minSeats: 1,
        maxSeats: 1,
        bestFor: 'Power users needing advanced models',
      },
      {
        planId: 'business',
        planName: 'Business',
        pricePerUserPerMonth: 19,
        minSeats: 2,
        maxSeats: null,
        bestFor: 'Teams needing centralized management',
      },
    ],
  },
  {
    toolId: 'claude',
    toolName: 'Claude',
    category: 'general',
    plans: [
      {
        planId: 'free',
        planName: 'Free',
        pricePerUserPerMonth: 0,
        minSeats: 1,
        maxSeats: 1,
        bestFor: 'Casual use',
      },
      {
        planId: 'pro',
        planName: 'Pro',
        pricePerUserPerMonth: 20,
        minSeats: 1,
        maxSeats: 1,
        bestFor: 'Power users and professionals',
      },
      {
        planId: 'max',
        planName: 'Max',
        pricePerUserPerMonth: 100,
        minSeats: 1,
        maxSeats: 1,
        bestFor: 'Heaviest individual users',
      },
      {
        planId: 'team',
        planName: 'Team',
        pricePerUserPerMonth: 30,
        minSeats: 2,
        maxSeats: null,
        bestFor: 'Teams collaborating on AI tasks',
      },
    ],
  },
  {
    toolId: 'chatgpt',
    toolName: 'ChatGPT',
    category: 'general',
    plans: [
      {
        planId: 'free',
        planName: 'Free',
        pricePerUserPerMonth: 0,
        minSeats: 1,
        maxSeats: 1,
        bestFor: 'Casual users',
      },
      {
        planId: 'plus',
        planName: 'Plus',
        pricePerUserPerMonth: 20,
        minSeats: 1,
        maxSeats: 1,
        bestFor: 'Individual professionals',
      },
      {
        planId: 'pro',
        planName: 'Pro',
        pricePerUserPerMonth: 200,
        minSeats: 1,
        maxSeats: 1,
        bestFor: 'Heaviest users needing maximum limits',
      },
      {
        planId: 'team',
        planName: 'Team',
        pricePerUserPerMonth: 30,
        minSeats: 2,
        maxSeats: null,
        bestFor: 'Small teams',
      },
    ],
  },
  {
    toolId: 'windsurf',
    toolName: 'Windsurf',
    category: 'coding',
    plans: [
      {
        planId: 'free',
        planName: 'Free',
        pricePerUserPerMonth: 0,
        minSeats: 1,
        maxSeats: 1,
        bestFor: 'Trying out AI coding',
      },
      {
        planId: 'pro',
        planName: 'Pro',
        pricePerUserPerMonth: 15,
        minSeats: 1,
        maxSeats: 1,
        bestFor: 'Individual developers — best value coding tool',
      },
      {
        planId: 'teams',
        planName: 'Teams',
        pricePerUserPerMonth: 30,
        minSeats: 2,
        maxSeats: null,
        bestFor: 'Teams needing admin dashboard',
      },
    ],
  },
  {
    toolId: 'antigravity',
    toolName: 'Google Antigravity',
    category: 'coding',
    plans: [
      {
        planId: 'free',
        planName: 'Free Preview',
        pricePerUserPerMonth: 0,
        minSeats: 1,
        maxSeats: null,
        bestFor: 'All developers during preview period',
      },
      {
        planId: 'pro',
        planName: 'Pro',
        pricePerUserPerMonth: 20,
        minSeats: 1,
        maxSeats: null,
        bestFor: 'Power users needing higher limits',
      },
    ],
  },
  {
    toolId: 'openai-api',
    toolName: 'OpenAI API',
    category: 'api',
    plans: [
      {
        planId: 'payg',
        planName: 'Pay As You Go',
        pricePerUserPerMonth: 0,
        minSeats: 1,
        maxSeats: null,
        bestFor: 'Teams using OpenAI models directly',
      },
    ],
  },
  {
    toolId: 'groq-api',
    toolName: 'Groq API',
    category: 'api',
    plans: [
      {
        planId: 'free',
        planName: 'Free Tier',
        pricePerUserPerMonth: 0,
        minSeats: 1,
        maxSeats: null,
        bestFor: 'Teams wanting free fast inference',
      },
    ],
  },
]

export function getToolById(toolId: string): Tool | undefined {
  return TOOLS.find((t) => t.toolId === toolId)
}

export function getPlanById(toolId: string, planId: string): Plan | undefined {
  const tool = getToolById(toolId)
  return tool?.plans.find((p) => p.planId === planId)
}

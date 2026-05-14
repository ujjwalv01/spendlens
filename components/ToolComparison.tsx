import React from 'react'

interface ToolComparisonProps {
  currentTool: string
  currentToolId: string
  currentPlan: string
  currentPrice: number
  recommendedTool: string
  recommendedToolId: string
  recommendedPrice: number
  useCase: string
  monthlySavings: number
  seats: number
}

const toolFeatures: Record<string, string[]> = {
  'cursor': [
    'Tab completions',
    'Agent mode',
    'Cloud agents',
    'Multi-file editing',
    'Codebase context',
  ],
  'windsurf': [
    'Tab completions',
    'Agent mode (Cascade)',
    'Multi-file editing',
    'Codebase context',
    'Free tier available',
  ],
  'github-copilot': [
    'Tab completions',
    'Agent mode',
    'Code review',
    'GitHub integration',
    'Multi-model support',
  ],
  'claude': [
    'Long context window',
    'Document analysis',
    'Code generation',
    'Writing assistance',
    'API access',
  ],
  'chatgpt': [
    'Conversation memory',
    'Image generation',
    'Code interpreter',
    'Plugin ecosystem',
    'Voice mode',
  ],
  'gemini': [
    'Google integration',
    'Long context window',
    'Image understanding',
    'Code generation',
    'Free tier available',
  ],
  'antigravity': [
    'Multi-agent mode',
    'Built-in browser',
    'Tab completions',
    'Gemini 3 Pro access',
    'Free preview tier',
  ],
}

export default function ToolComparison({
  currentTool,
  currentToolId,
  currentPlan,
  currentPrice,
  recommendedTool,
  recommendedToolId,
  recommendedPrice,
  useCase,
  monthlySavings,
  seats,
}: ToolComparisonProps) {
  return (
    <div className="mt-4">
      <div className="grid grid-cols-11 gap-2 items-start">
        
        {/* Current tool card - left */}
        <div className="col-span-5 bg-red-950/20 border border-red-800/30 rounded-xl p-4">
          <div className="text-red-300/60 text-xs uppercase tracking-widest mb-2">
            Current
          </div>
          <div className="text-white font-bold text-lg mb-1">
            {currentTool}
          </div>
          <div className="text-red-300 font-black text-2xl mb-3">
            ${currentPrice * seats}/mo
          </div>
          <div className="space-y-2">
            {(toolFeatures[currentToolId] || [])
              .map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <span className="text-red-400/60">✓</span>
                <span className="text-purple-200/60">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* VS divider */}
        <div className="col-span-1 flex items-center justify-center pt-8">
          <span className="text-purple-400/40 font-black text-sm">VS</span>
        </div>

        {/* Recommended tool card - right */}
        <div className="col-span-5 bg-violet-950/20 border border-violet-600/40 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute top-2 right-2 bg-violet-600 text-white text-[10px] px-2 py-1 rounded-full font-medium">
            Recommended
          </div>
          <div className="text-violet-300/60 text-xs uppercase tracking-widest mb-2">
            Switch To
          </div>
          <div className="text-white font-bold text-lg mb-1">
            {recommendedTool}
          </div>
          <div className="text-violet-300 font-black text-2xl mb-3">
            ${recommendedPrice * seats}/mo
          </div>
          <div className="space-y-2">
            {(toolFeatures[recommendedToolId] || [])
              .map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <span className="text-violet-400">✓</span>
                <span className="text-purple-200/80">
                  {feature}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-violet-700/30">
            <p className="text-violet-300 text-sm font-bold text-center">
              Save ${monthlySavings}/mo · ${monthlySavings * 12}/yr
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

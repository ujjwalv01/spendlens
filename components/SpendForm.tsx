'use client'

import { TOOLS, AuditInput, Tool, Plan } from '@/lib/pricingData'
import { runAudit } from '@/lib/auditEngine'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

type ToolState = {
  selected: boolean
  planId: string
  seats: number
  monthlySpend: number
}

type FormState = {
  selectedTools: Record<string, ToolState>
  teamSize: string
  useCase: string
}

const INITIAL_STATE: FormState = {
  selectedTools: TOOLS.reduce((acc, tool) => {
    const firstPlan = tool.plans[0]
    acc[tool.toolId] = {
      selected: false,
      planId: firstPlan.planId,
      seats: 1,
      monthlySpend: firstPlan.pricePerUserPerMonth,
    }
    return acc
  }, {} as Record<string, ToolState>),
  teamSize: '',
  useCase: '',
}

export default function SpendForm() {
  const router = useRouter()
  const [formState, setFormState] = useState<FormState>(INITIAL_STATE)
  const [error, setError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('spendlens-form')
    if (saved) {
      try {
        setFormState(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved form state')
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('spendlens-form', JSON.stringify(formState))
    }
  }, [formState, isLoaded])

  const toggleTool = (toolId: string) => {
    setFormState((prev) => ({
      ...prev,
      selectedTools: {
        ...prev.selectedTools,
        [toolId]: {
          ...prev.selectedTools[toolId],
          selected: !prev.selectedTools[toolId].selected,
        },
      },
    }))
  }

  const updateToolField = (
    toolId: string,
    field: keyof ToolState,
    value: any
  ) => {
    setFormState((prev) => {
      const tool = TOOLS.find((t) => t.toolId === toolId)
      const currentToolState = prev.selectedTools[toolId]
      const newState = { ...currentToolState, [field]: value }

      // Auto-update monthlySpend if plan or seats change
      if (field === 'planId' || field === 'seats') {
        const selectedPlan = tool?.plans.find((p) => p.planId === newState.planId)
        if (selectedPlan) {
          newState.monthlySpend = selectedPlan.pricePerUserPerMonth * newState.seats
        }
      }

      return {
        ...prev,
        selectedTools: {
          ...prev.selectedTools,
          [toolId]: newState,
        },
      }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const selectedTools = Object.entries(formState.selectedTools)
      .filter(([_, state]) => state.selected)
      .map(([id, state]) => ({ toolId: id, ...state }))

    // Validation
    if (selectedTools.length === 0) {
      setError('Please select at least one tool to audit.')
      return
    }

    for (const tool of selectedTools) {
      if (tool.seats < 1) {
        setError(`Seats for ${tool.toolId} must be at least 1.`)
        return
      }
      if (tool.monthlySpend < 0) {
        setError(`Monthly spend for ${tool.toolId} cannot be negative.`)
        return
      }
    }

    if (!formState.teamSize) {
      setError('Please select your team size.')
      return
    }

    if (!formState.useCase) {
      setError('Please select your primary use case.')
      return
    }

    // Prepare inputs
    const auditInputs: AuditInput[] = selectedTools.map((t) => ({
      toolId: t.toolId,
      planId: t.planId,
      seats: t.seats,
      monthlySpend: t.monthlySpend,
      useCase: formState.useCase as any,
    }))

    // Run audit
    const results = runAudit(auditInputs)

    // Save to localStorage
    localStorage.setItem('spendlens-audit', JSON.stringify(results))
    localStorage.setItem('spendlens-inputs', JSON.stringify(auditInputs))

    router.push('/audit')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-emerald-400">1. Select your tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TOOLS.map((tool) => {
            const isSelected = formState.selectedTools[tool.toolId].selected
            const toolState = formState.selectedTools[tool.toolId]
            const minPrice = Math.min(...tool.plans.map(p => p.pricePerUserPerMonth))

            return (
              <div
                key={tool.toolId}
                className={`transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-400 ring-1 ring-emerald-400/50'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                } border rounded-xl p-4`}
                onClick={() => toggleTool(tool.toolId)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-white">{tool.toolName}</h3>
                    <p className="text-xs text-slate-400">From ${minPrice}/mo</p>
                  </div>
                  <div className={`w-5 h-5 rounded border ${isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'} flex items-center justify-center`}>
                    {isSelected && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-black" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-4 space-y-4 pt-4 border-t border-slate-700" onClick={(e) => e.stopPropagation()}>
                    <div>
                      <label className="text-slate-300 text-xs mb-1 block">Plan</label>
                      <select
                        className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white w-full appearance-none text-sm"
                        value={toolState.planId}
                        onChange={(e) => updateToolField(tool.toolId, 'planId', e.target.value)}
                      >
                        {tool.plans.map((p) => (
                          <option key={p.planId} value={p.planId}>
                            {p.planName} (${p.pricePerUserPerMonth}/mo)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 text-xs mb-1 block">Seats</label>
                        <input
                          type="number"
                          min="1"
                          className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white w-full text-sm"
                          value={toolState.seats}
                          onChange={(e) => updateToolField(tool.toolId, 'seats', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 text-xs mb-1 block">Monthly Spend ($)</label>
                        <input
                          type="number"
                          className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-white w-full text-sm"
                          value={toolState.monthlySpend}
                          onChange={(e) => updateToolField(tool.toolId, 'monthlySpend', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-800">
        <h2 className="text-xl font-semibold text-emerald-400">2. About your team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-slate-300 text-sm mb-2 block font-medium">Total Team Size</label>
            <select
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white w-full appearance-none"
              value={formState.teamSize}
              onChange={(e) => setFormState({ ...formState, teamSize: e.target.value })}
            >
              <option value="">Select size...</option>
              <option value="1">1 (Solo)</option>
              <option value="2-5">2-5 members</option>
              <option value="6-10">6-10 members</option>
              <option value="11-50">11-50 members</option>
              <option value="51-200">51-200 members</option>
              <option value="200+">200+ members</option>
            </select>
          </div>
          <div>
            <label className="text-slate-300 text-sm mb-2 block font-medium">Primary AI Use Case</label>
            <select
              className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white w-full appearance-none"
              value={formState.useCase}
              onChange={(e) => setFormState({ ...formState, useCase: e.target.value })}
            >
              <option value="">Select use case...</option>
              <option value="coding">Software Development (Coding)</option>
              <option value="writing">Content & Copywriting</option>
              <option value="data">Data Analysis</option>
              <option value="research">Research & Strategy</option>
              <option value="mixed">General Purpose / Mixed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-8">
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all text-black font-bold py-4 px-8 rounded-xl w-full text-lg shadow-lg shadow-emerald-500/20"
        >
          Audit My Spend →
        </button>
        {error && <p className="text-red-400 text-sm mt-3 text-center animate-bounce">{error}</p>}
      </div>
    </form>
  )
}

import { useState } from 'react'
import { ChevronsUpDown } from 'lucide-react'
import { AIInsightGroup } from './AIInsightGroup'
import type { AIInsightGroup as AIInsightGroupType } from '../../data/mock'

interface AIInsightsPanelProps {
  groups: AIInsightGroupType[]
  depth?: 'l1' | 'l2' | 'sar'
}

export function AIInsightsPanel({ groups, depth = 'l1' }: AIInsightsPanelProps) {
  const [allExpanded, setAllExpanded] = useState(true)

  const totalItems = groups.reduce((n, g) => n + g.count, 0)
  const flaggedItems = groups.flatMap(g => g.items).filter(i => i.badge === 'flagged').length
  const clearItems = groups.flatMap(g => g.items).filter(i => i.badge === 'clear').length

  const depthLabel = depth === 'l1' ? 'L1' : depth === 'l2' ? 'L2' : 'SAR'

  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-900">AI Insights</span>
          <span className="text-2xs bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded font-medium uppercase">
            {depthLabel}
          </span>
          <span className="text-xs text-zinc-400">
            {flaggedItems > 0 ? (
              <>
                <span className="text-zinc-500 font-medium">{totalItems} items</span>
                {' · '}
                <span className="text-red-600 font-medium">{flaggedItems} flagged</span>
                {' · '}
                <span className="text-green-600 font-medium">{clearItems} clear</span>
              </>
            ) : (
              <span className="text-zinc-500">{totalItems} items complete</span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAllExpanded(v => !v)}
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            <ChevronsUpDown size={12} />
            {allExpanded ? 'Collapse All' : 'Expand All'}
          </button>
          <button className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
            Hide
          </button>
        </div>
      </div>

      {/* Groups */}
      <div key={allExpanded ? 'expanded' : 'collapsed'}>
        {groups.map(group => (
          <AIInsightGroup key={group.id} group={group} />
        ))}
      </div>
    </div>
  )
}

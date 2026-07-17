import { useState } from 'react'
import { ChevronDown, ChevronRight, Copy } from 'lucide-react'
import type { AIInsightGroup as AIInsightGroupType } from '../../data/mock'

const GROUP_CONFIG: Record<string, {
  border: string
  titleClass: string
  countBadge: boolean
}> = {
  'Needs Review':       { border: 'border-zinc-200', titleClass: 'font-semibold text-zinc-900', countBadge: false },
  'Adverse Signals':    { border: 'border-red-200',  titleClass: 'font-semibold text-zinc-900', countBadge: true  },
  'Mitigating Signals': { border: 'border-zinc-200', titleClass: 'font-medium text-zinc-400',   countBadge: false },
}

export function AIInsightGroup({ group }: { group: AIInsightGroupType }) {
  const [open, setOpen] = useState(group.defaultOpen ?? false)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const cfg = GROUP_CONFIG[group.title] ?? GROUP_CONFIG['Needs Review']
  const allExpanded = group.items.length > 0 && group.items.every(i => expandedRows.has(i.id))

  const toggleRow = (id: string) =>
    setExpandedRows(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedRows(new Set())
    } else {
      setExpandedRows(new Set(group.items.map(i => i.id)))
    }
  }

  return (
    <div className={`bg-white rounded-xl border ${cfg.border} overflow-hidden`}>
      {/* Group header row */}
      <div className="flex items-center gap-2 px-4 py-3">
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2 flex-1 min-w-0 text-left"
        >
          {open
            ? <ChevronDown size={13} className="text-zinc-400 shrink-0" />
            : <ChevronRight size={13} className="text-zinc-400 shrink-0" />}
          <span className={`text-sm ${cfg.titleClass}`}>{group.title}</span>
          {cfg.countBadge ? (
            <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-red-100 text-red-600 text-[11px] font-semibold rounded-full leading-none">
              {group.count}
            </span>
          ) : (
            <span className="text-sm text-zinc-400">{group.count}</span>
          )}
        </button>
        {open && (
          <button
            onClick={toggleAll}
            className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors shrink-0"
          >
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </button>
        )}
      </div>

      {/* Items */}
      {open && (
        <div className="border-t border-zinc-100 divide-y divide-zinc-50">
          {group.items.map(item => {
            const isOpen = expandedRows.has(item.id)
            const hasDetail = !!(item.detailText || item.detailBullets?.length)
            return (
              <div key={item.id} className="flex items-start gap-2 px-4 py-2.5">
                <button
                  onClick={() => hasDetail && toggleRow(item.id)}
                  className={`mt-0.5 shrink-0 transition-colors ${hasDetail ? 'text-zinc-400 hover:text-zinc-600 cursor-pointer' : 'text-zinc-200 cursor-default'}`}
                >
                  {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-relaxed">
                    <span className="font-semibold text-zinc-800">{item.label}</span>
                    <span className="text-zinc-400"> — </span>
                    <span className="text-zinc-500">{item.finding}</span>
                  </p>
                  {isOpen && hasDetail && (
                    <div className="mt-2 px-3 py-2.5 bg-zinc-50 rounded-lg border border-zinc-100 text-xs text-zinc-600 leading-relaxed">
                      {item.detailText && <p className={item.detailBullets?.length ? 'mb-2' : ''}>{item.detailText}</p>}
                      {item.detailBullets && (
                        <ul className="space-y-1">
                          {item.detailBullets.map((b, i) => <li key={i}>• {b}</li>)}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
                <div className="relative group shrink-0">
                  <button
                    onClick={() => navigator.clipboard.writeText(`${item.label} — ${item.finding}`)}
                    className="w-6 h-6 flex items-center justify-center text-zinc-300 hover:text-zinc-500 transition-colors"
                  >
                    <Copy size={11} />
                  </button>
                  <div className="absolute top-full right-0 mt-1.5 px-2 py-1 bg-zinc-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    Copy
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

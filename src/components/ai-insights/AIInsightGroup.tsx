import { useState } from 'react'
import clsx from 'clsx'
import { ChevronDown, ChevronRight, ThumbsUp, ThumbsDown } from 'lucide-react'
import type { AIInsightGroup as AIInsightGroupType } from '../../data/mock'

const BADGE_STYLES: Record<string, string> = {
  flagged: 'bg-red-100 text-red-700 border-red-200',
  clear:   'bg-green-100 text-green-700 border-green-200',
  info:    'bg-blue-100 text-blue-700 border-blue-200',
}

const GROUP_STYLES: Record<string, { header: string; dot: string }> = {
  'Needs Review':     { header: 'text-zinc-700', dot: 'bg-amber-400' },
  'Adverse Signals':  { header: 'text-zinc-700', dot: 'bg-red-400' },
  'Mitigating Signals': { header: 'text-zinc-700', dot: 'bg-green-400' },
}

export function AIInsightGroup({ group }: { group: AIInsightGroupType }) {
  const [open, setOpen] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set([group.items[0]?.id]))
  const style = GROUP_STYLES[group.title] ?? GROUP_STYLES['Needs Review']

  const toggleItem = (id: string) =>
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <div className="mb-1">
      {/* Group header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-zinc-50 transition-colors text-left"
      >
        <span className={clsx('w-2 h-2 rounded-full shrink-0', style.dot)} />
        <span className={clsx('text-xs font-semibold', style.header)}>{group.title}</span>
        <span className="text-xs text-zinc-400 font-normal">{group.count}</span>
        <span className="ml-auto text-zinc-400">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>

      {open && (
        <div className="divide-y divide-zinc-100">
          {group.items.map(item => {
            const isOpen = expanded.has(item.id)
            return (
              <div key={item.id} className="px-4 py-2.5">
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="mt-0.5 text-zinc-400 hover:text-zinc-600 shrink-0"
                  >
                    {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-zinc-800">{item.label}</span>
                      {item.badge && item.badgeLabel && (
                        <span className={clsx(
                          'text-2xs font-bold px-1.5 py-0.5 rounded border uppercase tracking-wide',
                          BADGE_STYLES[item.badge] ?? BADGE_STYLES.info
                        )}>
                          {item.badgeLabel}
                        </span>
                      )}
                      {isOpen && (
                        <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">
                          {item.finding}
                        </p>
                      )}
                    </div>
                    {!isOpen && (
                      <p className="text-xs text-zinc-500 truncate mt-0.5">{item.finding}</p>
                    )}
                    {isOpen && item.evidenceDetail && (
                      <p className="text-2xs text-zinc-400 mt-1 italic">{item.evidenceDetail}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button className="w-6 h-6 flex items-center justify-center text-zinc-300 hover:text-green-500 transition-colors rounded hover:bg-zinc-100">
                      <ThumbsUp size={12} />
                    </button>
                    <button className="w-6 h-6 flex items-center justify-center text-zinc-300 hover:text-red-500 transition-colors rounded hover:bg-zinc-100">
                      <ThumbsDown size={12} />
                    </button>
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

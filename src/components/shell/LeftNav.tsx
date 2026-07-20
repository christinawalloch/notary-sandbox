import { useState } from 'react'
import clsx from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { NavItem } from '../../config/workflows'

interface LeftNavProps {
  items: NavItem[]
  activeId: string
  onSelect: (id: string) => void
}

export function LeftNav({ items, activeId, onSelect }: LeftNavProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={clsx(
      'relative shrink-0 border-r border-zinc-200 bg-white transition-all duration-200 overflow-visible',
      collapsed ? 'w-0' : 'w-[152px]'
    )}>
      <button
        onClick={() => setCollapsed(v => !v)}
        className="absolute -right-3 top-4 z-20 w-6 h-6 rounded-full bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:border-zinc-300 transition-colors"
        title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>

      {!collapsed && (
        <nav className="h-full overflow-y-auto pt-2 pb-4">
          {items.map(item => (
            <div key={item.id}>
              {item.isSection ? (
                <div className="px-4 pt-3 pb-0.5">
                  <span className="text-2xs font-bold text-zinc-400 uppercase tracking-widest">
                    {item.label}
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => onSelect(item.id)}
                  className={clsx(
                    'w-full text-left px-4 py-1 text-xs transition-colors relative',
                    activeId === item.id
                      ? 'text-zinc-900 font-semibold before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-brand before:rounded-full'
                      : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
                  )}
                >
                  {item.label}
                </button>
              )}

              {item.children?.map(child => (
                <button
                  key={child.id}
                  onClick={() => onSelect(child.id)}
                  className={clsx(
                    'w-full text-left pl-7 pr-3 py-0.5 text-xs transition-colors relative',
                    activeId === child.id
                      ? 'text-zinc-800 font-medium before:absolute before:left-0 before:top-1 before:bottom-1 before:w-0.5 before:bg-brand before:rounded-full'
                      : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'
                  )}
                >
                  {child.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
      )}
    </div>
  )
}

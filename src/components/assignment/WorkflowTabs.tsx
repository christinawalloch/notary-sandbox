import clsx from 'clsx'
import type { TabConfig } from '../../config/workflows'

interface WorkflowTabsProps {
  tabs: TabConfig[]
  activeTab: string
  onTabChange: (id: string) => void
}

export function WorkflowTabs({ tabs, activeTab, onTabChange }: WorkflowTabsProps) {
  return (
    <div className="flex border-b border-zinc-200 mx-6 shrink-0">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={clsx(
            'px-4 py-1 text-sm font-medium border-b-2 -mb-px transition-colors',
            activeTab === tab.id
              ? 'border-brand text-brand-700'
              : 'border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

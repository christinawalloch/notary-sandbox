import { useState } from 'react'
import { ChevronRight, User } from 'lucide-react'
import clsx from 'clsx'
import type { Alert } from '../../data/mock'

export function AlertsTable({ alerts }: { alerts: Alert[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const toggle = (id: string) =>
    setExpanded(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-900 mb-3">Alerts</h3>
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
        {/* Table header */}
        <div className="grid grid-cols-[400px_160px_200px_140px] bg-zinc-50 border-b border-zinc-200 px-4 py-2">
          <span className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest" />
          <span className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest">ID</span>
          <span className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest">ACCOUNT</span>
          <span className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest">CREATED</span>
        </div>

        {alerts.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-zinc-400">No alerts</div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id}>
              <div
                className="grid grid-cols-[400px_160px_200px_140px] px-4 py-3 hover:bg-zinc-50 cursor-pointer transition-colors border-b border-zinc-100 last:border-0"
                onClick={() => toggle(alert.id)}
              >
                <div className="flex items-center gap-2 text-xs text-zinc-900 font-medium">
                  <ChevronRight
                    size={13}
                    className={clsx('transition-transform text-zinc-400', expanded.has(alert.id) && 'rotate-90')}
                  />
                  {alert.executionLabel ?? 'Execution Details'}
                </div>
                <span className="text-xs text-zinc-800 font-mono self-center">{alert.id}</span>
                <div className="flex items-center gap-1.5 self-center">
                  <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center">
                    <User size={11} className="text-brand-700" />
                  </div>
                  <span className="text-xs text-brand-600 font-mono">{alert.accountId}</span>
                </div>
                <span className="text-xs text-zinc-600 self-center">{alert.created}</span>
              </div>
              {expanded.has(alert.id) && (
                <div className="bg-zinc-50 border-b border-zinc-100 px-8 py-3 text-xs text-zinc-500">
                  {alert.typology ? (
                    <span>Typology: <span className="font-medium text-zinc-700">{alert.typology}</span></span>
                  ) : (
                    <span className="text-zinc-400">No additional execution detail available.</span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

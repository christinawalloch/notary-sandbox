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
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
        <div className="grid grid-cols-[300px_160px_200px_140px_240px] bg-zinc-50 border-b border-zinc-200 px-4 py-2">
          <span className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest">ALERTS</span>
          <span className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest">ID</span>
          <span className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest">ACCOUNT</span>
          <span className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest">CREATED</span>
          <span className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest">TYPE</span>
        </div>

        {alerts.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-zinc-400">No alerts</div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id}>
              <div
                className="grid grid-cols-[300px_160px_200px_140px_240px] px-4 py-3 hover:bg-zinc-50 cursor-pointer transition-colors border-b border-zinc-100 last:border-0"
                onClick={() => toggle(alert.id)}
              >
                <div className="flex items-center gap-2 text-xs text-zinc-900 font-medium">
                  <ChevronRight
                    size={13}
                    className={clsx('transition-transform text-zinc-400 shrink-0', expanded.has(alert.id) && 'rotate-90')}
                  />
                  Execution Details
                </div>
                <span className="text-xs text-zinc-800 font-mono self-center">{alert.id}</span>
                <div className="flex items-center gap-1.5 self-center">
                  <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center">
                    <User size={11} className="text-brand-700" />
                  </div>
                  <span className="text-xs text-brand-600 font-mono">{alert.accountId}</span>
                </div>
                <span className="text-xs text-zinc-600 self-center">{alert.created}</span>
                <div className="self-center">
                  {alert.shortLabel && (
                    <span className="text-xs text-zinc-500">{alert.shortLabel}</span>
                  )}
                </div>
              </div>

              {expanded.has(alert.id) && (
                <div className="bg-zinc-50/60 border-b border-zinc-100 px-8 py-4 space-y-4">
                  {alert.ruleName ? (
                    <>
                      <div>
                        <p className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest mb-0.5">
                          {alert.ruleId} · {alert.typology}
                        </p>
                        <p className="text-xs font-semibold text-zinc-800">{alert.ruleName}</p>
                      </div>

                      {alert.triggerSummary && (
                        <p className="text-xs text-zinc-600 leading-relaxed">{alert.triggerSummary}</p>
                      )}

                      {alert.details && alert.details.length > 0 && (
                        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                          {alert.details.map(d => (
                            <div key={d.label} className="flex gap-2">
                              <span className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest w-36 shrink-0 pt-px">{d.label}</span>
                              <span className="text-xs text-zinc-700">{d.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : alert.typology ? (
                    <span className="text-xs text-zinc-600">Typology: <span className="font-medium text-zinc-700">{alert.typology}</span></span>
                  ) : (
                    <span className="text-xs text-zinc-400">No additional execution detail available.</span>
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

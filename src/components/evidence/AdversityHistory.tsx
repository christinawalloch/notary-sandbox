import clsx from 'clsx'
import type { AdversityRecord } from '../../data/mock'

const TYPE_STYLES: Record<string, { label: string; className: string }> = {
  DENYLIST: { label: 'Denylist', className: 'bg-red-50 text-red-700 border-red-200' },
  STRIKE:   { label: 'Strike',   className: 'bg-amber-50 text-amber-700 border-amber-200' },
  WARNING:  { label: 'Warning',  className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
}

function TypeBadge({ type }: { type: string }) {
  const s = TYPE_STYLES[type] ?? { label: type, className: 'bg-zinc-100 text-zinc-600 border-zinc-200' }
  return (
    <span className={clsx('inline-flex text-2xs font-semibold px-1.5 py-0.5 rounded border whitespace-nowrap', s.className)}>
      {s.label}
    </span>
  )
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={clsx(
      'inline-flex text-2xs font-semibold px-1.5 py-0.5 rounded border whitespace-nowrap',
      active ? 'bg-red-50 text-red-700 border-red-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
    )}>
      {active ? 'Active' : 'Revoked'}
    </span>
  )
}

const COLS = ['ISSUED BY', 'TYPE', 'ORGANIZATION', 'REASON', 'ISSUED', 'REVOKED BY', 'REVOKE REASON', 'STATUS']
const GRID = 'grid-cols-[150px_80px_110px_1fr_110px_150px_170px_80px]'

export function AdversityHistory({ records, standalone }: { records: AdversityRecord[]; standalone?: boolean }) {
  const content = (
    <>
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-zinc-900">Adversity History</h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          Guardrails Adversities include denylists, strikes, and warnings.
        </p>
      </div>

      <div className="border border-zinc-200 rounded-xl overflow-hidden">
        <div>
            <div className={clsx('grid gap-x-4 bg-zinc-50 border-b border-zinc-200 px-4 py-2', GRID)}>
              {COLS.map(col => (
                <span key={col} className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest">
                  {col}
                </span>
              ))}
            </div>

            {records.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-zinc-400">No adversity history</div>
            ) : (
              records.map((record, i) => {
                const isActive = !record.revokedBy || record.revokedBy === '—'
                return (
                  <div
                    key={record.id}
                    className={clsx(
                      'grid gap-x-4 px-4 py-3',
                      GRID,
                      i < records.length - 1 && 'border-b border-zinc-100'
                    )}
                  >
                    <div className="text-xs text-zinc-800">{record.issuedBy}</div>
                    <div className="pt-0.5"><TypeBadge type={record.type} /></div>
                    <div className="text-xs text-zinc-700 pt-0.5">{record.organization}</div>
                    <div className="flex flex-col gap-0.5">
                      {record.reasons?.map((r, j) => (
                        <span key={j} className="text-xs text-zinc-700">{r}</span>
                      ))}
                      {record.reasonCodes?.map((code, j) => (
                        <span key={j} className="text-2xs font-mono text-zinc-400">{code}</span>
                      ))}
                    </div>
                    <div className="text-xs text-zinc-500">{record.issuedAt}</div>
                    <div className="text-xs text-zinc-500">{record.revokedBy ?? '—'}</div>
                    <div className="text-xs text-zinc-500">{record.revokeReason ?? '—'}</div>
                    <div className="pt-0.5"><StatusBadge active={isActive} /></div>
                  </div>
                )
              })
            )}
        </div>
      </div>
    </>
  )

  if (standalone) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 px-4 pt-3 pb-4">
        {content}
      </div>
    )
  }

  return <div>{content}</div>
}

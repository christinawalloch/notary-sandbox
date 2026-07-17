import clsx from 'clsx'
import type { IDVAttempt } from '../../data/mock'

const DECISION_STYLES: Record<IDVAttempt['decision'], string> = {
  'VERIFIED':      'bg-emerald-50 text-emerald-700 border-emerald-200',
  'FAILED':        'bg-red-50 text-red-700 border-red-200',
  'MANUAL REVIEW': 'bg-amber-50 text-amber-700 border-amber-200',
}

function DecisionBadge({ decision }: { decision: IDVAttempt['decision'] }) {
  return (
    <span className={clsx(
      'inline-flex text-2xs font-semibold px-1.5 py-0.5 rounded border whitespace-nowrap',
      DECISION_STYLES[decision]
    )}>
      {decision}
    </span>
  )
}

const COLS = ['CREATED', 'DECISION', 'NAME', 'BIRTH DATE', 'SOURCE', 'LAST 4 SSN', 'DOCUMENTS']
const GRID = 'grid-cols-[110px_130px_140px_110px_100px_100px_1fr]'

export function IDVAttempts({ attempts, standalone }: { attempts: IDVAttempt[]; standalone?: boolean }) {
  const inner = (
    <>
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-zinc-900">IDV Attempts</h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          Identity verification attempts associated with this account.
        </p>
      </div>

      <div className="border border-zinc-200 rounded-xl overflow-hidden">
        <div className={clsx('grid gap-x-4 bg-zinc-50 border-b border-zinc-200 px-4 py-2', GRID)}>
          {COLS.map(col => (
            <span key={col} className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest">
              {col}
            </span>
          ))}
        </div>

        {attempts.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-zinc-400">No IDV attempts</div>
        ) : (
          attempts.map((attempt, i) => (
            <div
              key={attempt.id}
              className={clsx(
                'grid gap-x-4 px-4 py-3',
                GRID,
                i < attempts.length - 1 && 'border-b border-zinc-100'
              )}
            >
              <div className="text-xs text-zinc-700">{attempt.created}</div>
              <div className="pt-0.5"><DecisionBadge decision={attempt.decision} /></div>
              <div className="text-xs text-zinc-800 font-medium">{attempt.name}</div>
              <div className="text-xs text-zinc-700">{attempt.birthDate}</div>
              <div className="text-xs text-zinc-700">{attempt.source}</div>
              <div className="text-xs font-mono text-zinc-700">••••{attempt.last4SSN}</div>
              <div className="flex flex-wrap gap-1">
                {attempt.documents.map((doc, j) => (
                  <span key={j} className="text-2xs bg-zinc-100 text-zinc-600 border border-zinc-200 px-1.5 py-0.5 rounded">
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )

  if (standalone) {
    return <div className="bg-white rounded-xl border border-zinc-200 px-4 pt-3 pb-4">{inner}</div>
  }
  return <div>{inner}</div>
}

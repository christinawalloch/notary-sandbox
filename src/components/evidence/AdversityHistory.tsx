import type { AdversityRecord } from '../../data/mock'

function TypeBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded border border-zinc-300 bg-white text-2xs font-semibold text-zinc-700 uppercase tracking-wide">
      {label}
    </span>
  )
}

function OrgBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded border border-zinc-300 bg-white text-2xs font-semibold text-zinc-600 uppercase tracking-wide">
      {label}
    </span>
  )
}

function ReasonCodeBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded border border-zinc-300 bg-white text-2xs font-semibold text-zinc-600 uppercase tracking-wide">
      {label}
    </span>
  )
}

export function AdversityHistory({ records }: { records: AdversityRecord[] }) {
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-zinc-900">Adversity History</h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          Guardrails' Adversities include denylists, strikes, and warnings.
        </p>
      </div>

      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
        {/* Header */}
        <div className="grid grid-cols-[180px_220px_160px_1fr_140px_140px] bg-zinc-50 border-b border-zinc-200 px-4 py-2">
          {['ISSUED BY', 'TYPE', 'ORGANIZATION', 'REASONS', 'REVOKED BY', 'REVOKE REASON'].map(col => (
            <span key={col} className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest">
              {col}
            </span>
          ))}
        </div>

        {records.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-zinc-400">No adversity history</div>
        ) : (
          records.map((record, i) => (
            <div
              key={record.id}
              className={`grid grid-cols-[180px_220px_160px_1fr_140px_140px] px-4 py-3 ${i < records.length - 1 ? 'border-b border-zinc-100' : ''}`}
            >
              {/* Issued By */}
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-zinc-800">{record.issuedBy}</span>
                <span className="text-xs text-zinc-500">{record.issuedAt}</span>
              </div>

              {/* Type */}
              <div className="flex items-start pt-0.5">
                <TypeBadge label={record.type} />
              </div>

              {/* Organization */}
              <div className="flex items-start pt-0.5">
                <OrgBadge label={record.organization} />
              </div>

              {/* Reasons */}
              <div className="flex flex-col gap-1 items-start">
                {record.reasons?.map((r, j) => (
                  <span key={j} className="text-xs text-zinc-700">{r}</span>
                ))}
                {record.reasonCodes?.map(code => (
                  <ReasonCodeBadge key={code} label={code} />
                ))}
              </div>

              {/* Revoked By */}
              <div className="text-xs text-zinc-500">{record.revokedBy ?? ''}</div>

              {/* Revoke Reason */}
              <div className="text-xs text-zinc-500">{record.revokeReason ?? ''}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

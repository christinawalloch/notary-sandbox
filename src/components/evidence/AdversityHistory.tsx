import type { AdversityRecord } from '../../data/mock'

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
        <div className="grid grid-cols-[180px_150px_160px_1fr_140px_140px] bg-zinc-50 border-b border-zinc-200 px-4 py-2">
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
              className={`grid grid-cols-[180px_150px_160px_1fr_140px_140px] px-4 py-3 ${i < records.length - 1 ? 'border-b border-zinc-100' : ''}`}
            >
              {/* Issued By */}
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-zinc-800">{record.issuedBy}</span>
                <span className="text-xs text-zinc-500">{record.issuedAt}</span>
              </div>

              {/* Type */}
              <div className="text-xs text-zinc-700 pt-0.5">{record.type}</div>

              {/* Organization */}
              <div className="text-xs text-zinc-700 pt-0.5">{record.organization}</div>

              {/* Reasons */}
              <div className="flex flex-col gap-1">
                {record.reasons?.map((r, j) => (
                  <span key={j} className="text-xs text-zinc-700">{r}</span>
                ))}
                {record.reasonCodes?.map((code, j) => (
                  <span key={j} className="text-xs text-zinc-700">{code}</span>
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

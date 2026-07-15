import { useState } from 'react'
import { ExternalLink, Plus, Minus } from 'lucide-react'
import type { Account } from '../../data/mock'

const FILLED_TAGS = new Set(['PERSONAL', 'BUSINESS'])

export function AccountDetails({ account, expandedContent }: { account: Account; expandedContent?: React.ReactNode }) {
  const [showExtra, setShowExtra] = useState(false)

  return (
    <div className="pt-4 mt-4 border-t border-zinc-100">
      <h3 className="text-sm font-semibold text-zinc-900 mb-3">Account Details</h3>

      {/* Inline fields row 1 */}
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-xs mb-1.5">
        <span>
          <span className="font-semibold text-zinc-900">Customer Token</span>{' '}
          <span className="font-mono text-brand">{account.id}</span>
        </span>
        {account.regulator && (
          <span className="inline-flex items-center gap-1">
            <span className="font-semibold text-zinc-900">Regulator</span>
            <ExternalLink size={11} className="text-brand" />
          </span>
        )}
        <span>
          <span className="font-semibold text-zinc-900">Display Name</span>{' '}
          <span className="text-brand">{account.displayName}</span>
        </span>
        {account.legalName && (
          <span>
            <span className="font-semibold text-zinc-900">Legal Name</span>{' '}
            <span className="text-brand">{account.legalName}</span>
          </span>
        )}
        <span>
          <span className="font-semibold text-zinc-900">Email</span>{' '}
          <span className="text-brand">{account.email ?? '—'}</span>
        </span>
        <span>
          <span className="font-semibold text-zinc-900">Phone</span>{' '}
          <span className="text-zinc-700">{account.phone ?? '-'}</span>
        </span>
        {account.joined && (
          <span>
            <span className="font-semibold text-zinc-900">Joined</span>{' '}
            <span className="text-zinc-700">{account.joined}</span>
          </span>
        )}
      </div>

      {/* Address row */}
      {account.address && (
        <div className="text-xs mb-3">
          <span className="font-semibold text-zinc-900">Address</span>{' '}
          <span className="text-zinc-700">{account.address}</span>
        </div>
      )}

      {/* Compliance Tags */}
      {account.complianceTags && account.complianceTags.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 mb-1.5">
            Compliance Tags
            <button className="inline-flex items-center justify-center w-4 h-4 rounded bg-zinc-100 text-zinc-500 hover:bg-zinc-200 text-xs font-medium leading-none transition-colors">+</button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {account.complianceTags.map(tag => (
              <span
                key={tag}
                className={`text-2xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wide border ${
                  FILLED_TAGS.has(tag)
                    ? 'bg-brand text-white border-brand'
                    : 'bg-white text-zinc-700 border-zinc-300'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons + Show/Hide Details toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {['Toolbox', 'Regulator', 'Adverse Media', 'Chainalysis', 'Transaction Search'].map(action => (
            <button
              key={action}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-200 rounded-lg text-xs font-medium text-zinc-900 hover:bg-zinc-50 transition-colors"
            >
              <ExternalLink size={11} />
              {action}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowExtra(v => !v)}
          className="flex items-center gap-1 text-xs font-medium text-brand hover:opacity-80 transition-opacity shrink-0 whitespace-nowrap"
        >
          {showExtra ? <Minus size={12} /> : <Plus size={12} />}
          {showExtra ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      {showExtra && expandedContent && (
        <div className="mt-6 space-y-6 border-t border-zinc-100 pt-6">
          {expandedContent}
        </div>
      )}
    </div>
  )
}

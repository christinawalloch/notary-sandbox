import { useState } from 'react'
import { ExternalLink, Plus, Minus, CheckCircle2 } from 'lucide-react'
import type { Account } from '../../data/mock'

export function CustomerCard({ customer }: { customer: Account }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-zinc-200 px-4 pt-3 pb-4">
      <div className="flex items-start justify-between gap-6">
        {/* Left: customer info */}
        <div className="flex-1 min-w-0">
          {/* Name row */}
          <div className="flex items-center gap-2 mb-1.5">
            <h2 className="text-base font-bold text-zinc-900">Customer</h2>
            <h2 className="text-base font-bold text-zinc-900">{customer.displayName}</h2>
            {customer.verified && (
              <CheckCircle2 size={14} className="text-brand shrink-0" fill="currentColor" stroke="white" strokeWidth={2} />
            )}
          </div>

          {/* Fields row 1 */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-xs leading-relaxed">
            {customer.legalName && (
              <span>
                <span className="font-semibold text-zinc-900">Legal Name</span>{' '}
                <span className="text-brand">{customer.legalName}</span>
              </span>
            )}
            <span>
              <span className="font-semibold text-zinc-900">Customer Token</span>{' '}
              <span className="font-mono text-brand">{customer.id}</span>
            </span>
            {customer.accountToken && (
              <span>
                <span className="font-semibold text-zinc-900">Account Token</span>{' '}
                <span className="font-mono text-zinc-700">{customer.accountToken}</span>
              </span>
            )}
            <span>
              <span className="font-semibold text-zinc-900">Email</span>{' '}
              <span className="text-brand">{customer.email ?? '—'}</span>
            </span>
            <span>
              <span className="font-semibold text-zinc-900">Phone</span>{' '}
              <span className="text-zinc-700">{customer.phone ?? 'N/A'}</span>
            </span>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 text-xs font-medium text-zinc-900 border border-zinc-200 px-2.5 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors whitespace-nowrap">
            <ExternalLink size={11} />
            Check TLO
          </button>
          <button className="flex items-center gap-1.5 text-xs font-medium text-zinc-900 border border-zinc-200 px-2.5 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors whitespace-nowrap">
            <ExternalLink size={11} />
            Adverse Media
          </button>
          <button
            onClick={() => setShowDetails(v => !v)}
            className="flex items-center gap-1 text-xs font-medium text-brand hover:opacity-80 transition-opacity shrink-0 whitespace-nowrap"
          >
            {showDetails ? <Minus size={12} /> : <Plus size={12} />}
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>
    </div>
  )
}

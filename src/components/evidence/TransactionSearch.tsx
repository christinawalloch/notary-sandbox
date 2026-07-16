import clsx from 'clsx'
import { ArrowDownLeft, ArrowUpRight, Search } from 'lucide-react'
import type { Transaction } from '../../data/mock'

function DirectionIcon({ direction }: { direction: 'IN' | 'OUT' }) {
  return direction === 'IN'
    ? <ArrowDownLeft size={11} className="text-emerald-600" />
    : <ArrowUpRight size={11} className="text-red-500" />
}

function FilterChip({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border select-none',
      accent
        ? 'bg-brand/10 text-brand border-brand/30'
        : 'bg-zinc-50 text-zinc-600 border-zinc-200'
    )}>
      {label}
    </span>
  )
}

const COLS = ['DATE', 'TYPE', 'DIRECTION', 'AMOUNT', 'COUNTERPARTY', 'NOTE', 'STATUS']

export function TransactionSearch({ transactions, accountId }: { transactions: Transaction[]; accountId: string }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 px-5 py-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-zinc-900">Transaction Search</h3>
        <span className="inline-flex text-2xs font-semibold px-1.5 py-0.5 rounded border bg-violet-50 text-violet-600 border-violet-200 uppercase tracking-wide">
          Beta
        </span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-full px-2.5 py-1 text-xs text-zinc-500">
          <Search size={11} />
          <span className="text-zinc-400">Search transactions…</span>
        </div>
        <FilterChip label={accountId} accent />
        <FilterChip label="Last 90 days" />
        <FilterChip label="All directions" />
        <FilterChip label="All types" />
      </div>

      {/* Table */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <div style={{ minWidth: 780 }}>
            {/* Header */}
            <div className="grid grid-cols-[140px_110px_80px_100px_150px_1fr_90px] gap-x-4 bg-zinc-50 border-b border-zinc-200 px-4 py-2">
              {COLS.map(col => (
                <span key={col} className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest">
                  {col}
                </span>
              ))}
            </div>

            {transactions.length === 0 ? (
              <div className="px-4 py-8 text-center text-xs text-zinc-400">No transactions found</div>
            ) : (
              transactions.map((txn, i) => (
                <div
                  key={txn.id}
                  className={clsx(
                    'grid grid-cols-[140px_110px_80px_100px_150px_1fr_90px] gap-x-4 px-4 py-2.5 items-center',
                    i < transactions.length - 1 && 'border-b border-zinc-100',
                    'hover:bg-zinc-50 transition-colors'
                  )}
                >
                  {/* Date */}
                  <div className="text-xs text-zinc-600 font-mono">{txn.date}</div>

                  {/* Type */}
                  <div className="text-xs text-zinc-700">{txn.type}</div>

                  {/* Direction */}
                  <div className="flex items-center gap-1">
                    <DirectionIcon direction={txn.direction} />
                    <span className={clsx(
                      'text-xs font-medium',
                      txn.direction === 'IN' ? 'text-emerald-600' : 'text-red-500'
                    )}>
                      {txn.direction}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className={clsx(
                    'text-xs font-semibold tabular-nums',
                    txn.direction === 'IN' ? 'text-emerald-700' : 'text-zinc-800'
                  )}>
                    {txn.direction === 'IN' ? '+' : '−'}{txn.amount}
                  </div>

                  {/* Counterparty */}
                  <div className="text-xs text-zinc-800 font-medium truncate">{txn.counterparty}</div>

                  {/* Note */}
                  <div className="text-xs text-zinc-400 truncate">{txn.note ?? ''}</div>

                  {/* Status */}
                  <div className="text-xs text-zinc-500">{txn.status}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 text-2xs text-zinc-400 text-right">
        {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}

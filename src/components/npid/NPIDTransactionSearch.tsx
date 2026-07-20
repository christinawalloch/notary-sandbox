import clsx from 'clsx'
import { ArrowDownLeft, ArrowUpRight, Search } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClusterTransaction {
  id: string
  accountLabel: string
  accountToken: string
  date: string
  type: string
  amount: string
  direction: 'IN' | 'OUT'
  counterparty: string
  note?: string
  status: string
  interCluster?: boolean
}

// ─── Mock data ────────────────────────────────────────────────────────────────
// Combined money movement across all 4 accounts in NPID_123456.
// Counterparties that match cluster cashtags ($johndoe, $j.doe34,
// $johndoebiz, $jondoe8) are flagged interCluster for visual emphasis.

const TRANSACTIONS: ClusterTransaction[] = [
  { id: 'n1',  accountLabel: 'John Doe',     accountToken: 'c_8hpfrgye4', date: 'May 20, 2026', type: 'P2P Transfer',    amount: '$500.00',    direction: 'OUT', counterparty: '$johndoebiz',       note: 'Rent share',             status: 'Completed', interCluster: true  },
  { id: 'n2',  accountLabel: 'John Doe LLC', accountToken: 'c_3kmt7wx92', date: 'May 20, 2026', type: 'P2P Transfer',    amount: '$500.00',    direction: 'IN',  counterparty: '$johndoe',           note: 'Rent share',             status: 'Completed', interCluster: true  },
  { id: 'n3',  accountLabel: 'John Doe',     accountToken: 'c_8hpfrgye4', date: 'May 15, 2026', type: 'Direct Deposit',  amount: '$4,200.00',  direction: 'IN',  counterparty: 'Acme Corp (ACH)',                                    status: 'Completed'                },
  { id: 'n4',  accountLabel: 'J. Doe',       accountToken: 'c_5rlj8b34',  date: 'May 18, 2026', type: 'P2P Transfer',    amount: '$200.00',    direction: 'OUT', counterparty: '$jondoe8',           note: 'Split bill',             status: 'Completed', interCluster: true  },
  { id: 'n5',  accountLabel: 'Jon Doe',      accountToken: 'c_9qnv2pz81', date: 'May 18, 2026', type: 'P2P Transfer',    amount: '$200.00',    direction: 'IN',  counterparty: '$j.doe34',           note: 'Split bill',             status: 'Completed', interCluster: true  },
  { id: 'n6',  accountLabel: 'John Doe LLC', accountToken: 'c_3kmt7wx92', date: 'May 1, 2026',  type: 'Payout',          amount: '$1,800.00',  direction: 'OUT', counterparty: 'Stripe Payout',                                      status: 'Completed'                },
  { id: 'n7',  accountLabel: 'J. Doe',       accountToken: 'c_5rlj8b34',  date: 'May 5, 2026',  type: 'P2P Transfer',    amount: '$175.00',    direction: 'IN',  counterparty: '$karenkk',                                           status: 'Completed'                },
  { id: 'n8',  accountLabel: 'John Doe',     accountToken: 'c_8hpfrgye4', date: 'Apr 30, 2026', type: 'Cash Out',        amount: '$1,000.00',  direction: 'OUT', counterparty: 'Bank of America ****3812',                           status: 'Completed'                },
  { id: 'n9',  accountLabel: 'John Doe',     accountToken: 'c_8hpfrgye4', date: 'Apr 12, 2026', type: 'P2P Transfer',    amount: '$250.00',    direction: 'OUT', counterparty: '$jondoe8',           note: 'Utilities',              status: 'Completed', interCluster: true  },
  { id: 'n10', accountLabel: 'Jon Doe',      accountToken: 'c_9qnv2pz81', date: 'Apr 12, 2026', type: 'P2P Transfer',    amount: '$250.00',    direction: 'IN',  counterparty: '$johndoe',           note: 'Utilities',              status: 'Completed', interCluster: true  },
  { id: 'n11', accountLabel: 'Jon Doe',      accountToken: 'c_9qnv2pz81', date: 'Apr 1, 2026',  type: 'Cash In',         amount: '$800.00',    direction: 'IN',  counterparty: 'Venmo Transfer',                                     status: 'Completed'                },
  { id: 'n12', accountLabel: 'John Doe LLC', accountToken: 'c_3kmt7wx92', date: 'Mar 28, 2026', type: 'P2P Transfer',    amount: '$3,500.00',  direction: 'IN',  counterparty: '$vendor_az',         note: 'Invoice #1048',          status: 'Completed'                },
  { id: 'n13', accountLabel: 'J. Doe',       accountToken: 'c_5rlj8b34',  date: 'Mar 15, 2026', type: 'P2P Transfer',    amount: '$90.00',     direction: 'OUT', counterparty: '$groceries99',                                       status: 'Completed'                },
  { id: 'n14', accountLabel: 'John Doe LLC', accountToken: 'c_3kmt7wx92', date: 'Mar 10, 2026', type: 'Cash Out',        amount: '$2,000.00',  direction: 'OUT', counterparty: 'Wells Fargo ****1209',                               status: 'Completed'                },
  { id: 'n15', accountLabel: 'Jon Doe',      accountToken: 'c_9qnv2pz81', date: 'Mar 5, 2026',  type: 'P2P Transfer',    amount: '$150.00',    direction: 'OUT', counterparty: '$utilitypay',        note: 'Electric bill',          status: 'Completed'                },
  { id: 'n16', accountLabel: 'J. Doe',       accountToken: 'c_5rlj8b34',  date: 'Mar 2, 2026',  type: 'Cash In',         amount: '$1,200.00',  direction: 'IN',  counterparty: 'PayPal Transfer',                                    status: 'Completed'                },
]

const CLUSTER_ACCOUNTS = [
  { token: 'c_8hpfrgye4', label: 'John Doe' },
  { token: 'c_5rlj8b34',  label: 'J. Doe' },
  { token: 'c_3kmt7wx92', label: 'John Doe LLC' },
  { token: 'c_9qnv2pz81', label: 'Jon Doe' },
]

const COLS = ['ACCOUNT', 'DATE', 'TYPE', 'DIR', 'AMOUNT', 'COUNTERPARTY', 'NOTE', 'STATUS']
const GRID = 'grid-cols-[130px_110px_100px_50px_90px_140px_1fr_80px]'

// ─── Component ────────────────────────────────────────────────────────────────

function DirectionIcon({ direction }: { direction: 'IN' | 'OUT' }) {
  return direction === 'IN'
    ? <ArrowDownLeft size={11} className="text-emerald-600" />
    : <ArrowUpRight size={11} className="text-red-500" />
}

export function NPIDTransactionSearch() {
  const interClusterCount = TRANSACTIONS.filter(t => t.interCluster).length / 2

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-full px-2.5 py-1 text-xs text-zinc-500">
          <Search size={11} />
          <span className="text-zinc-400">Search transactions…</span>
        </div>
        {CLUSTER_ACCOUNTS.map(a => (
          <span
            key={a.token}
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border bg-brand/10 text-brand border-brand/30 select-none"
          >
            {a.token}
          </span>
        ))}
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border bg-zinc-50 text-zinc-600 border-zinc-200 select-none">
          Last 90 days
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border bg-zinc-50 text-zinc-600 border-zinc-200 select-none">
          All directions
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border bg-zinc-50 text-zinc-600 border-zinc-200 select-none">
          All types
        </span>
      </div>

      {/* Table */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <div style={{ minWidth: 820 }}>
            {/* Header */}
            <div className={clsx('grid gap-x-3 bg-zinc-50 border-b border-zinc-200 px-4 py-2', GRID)}>
              {COLS.map(col => (
                <span key={col} className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest">
                  {col}
                </span>
              ))}
            </div>

            {TRANSACTIONS.map((txn, i) => (
              <div
                key={txn.id}
                className={clsx(
                  'grid gap-x-3 px-4 py-2.5 items-center hover:bg-zinc-50 transition-colors',
                  GRID,
                  i < TRANSACTIONS.length - 1 && 'border-b border-zinc-100',
                  txn.interCluster && 'bg-amber-50/40 hover:bg-amber-50/60'
                )}
              >
                {/* Account */}
                <div>
                  <div className="text-xs font-medium text-zinc-800 truncate">{txn.accountLabel}</div>
                  <div className="text-2xs font-mono text-zinc-400 truncate">{txn.accountToken}</div>
                </div>

                {/* Date */}
                <div className="text-xs text-zinc-600 font-mono">{txn.date}</div>

                {/* Type */}
                <div className="text-xs text-zinc-700 truncate">{txn.type}</div>

                {/* Direction */}
                <div className="flex items-center gap-1">
                  <DirectionIcon direction={txn.direction} />
                </div>

                {/* Amount */}
                <div className={clsx(
                  'text-xs font-semibold tabular-nums',
                  txn.direction === 'IN' ? 'text-emerald-700' : 'text-zinc-800'
                )}>
                  {txn.direction === 'IN' ? '+' : '−'}{txn.amount}
                </div>

                {/* Counterparty */}
                <div className={clsx(
                  'text-xs font-medium truncate',
                  txn.interCluster ? 'text-amber-700' : 'text-zinc-800'
                )}>
                  {txn.counterparty}
                </div>

                {/* Note */}
                <div className="text-xs text-zinc-400 truncate">{txn.note ?? ''}</div>

                {/* Status */}
                <div className="text-xs text-zinc-500">{txn.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-2xs text-zinc-400">
        <span>{interClusterCount} intra-cluster transfer pair{interClusterCount !== 1 ? 's' : ''} highlighted</span>
        <span>{TRANSACTIONS.length} transactions</span>
      </div>
    </div>
  )
}

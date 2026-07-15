import { Search, Users } from 'lucide-react'
import clsx from 'clsx'

// ─── Data ─────────────────────────────────────────────────────────────────────

interface ClusterAccount {
  id: string
  token: string
  displayName: string
  legalName: string
  cashtag: string
  verifiedName: string
  accountType: string
  verificationType: string
  created: string
  npid: string
  status: 'ACTIVE' | 'SUSPENDED'
  hideStatus?: boolean
  verification: string
  extraTags: { label: string; color: 'red' | 'orange' }[]
  avatarLetter: string
  avatarColor: string
  holder?: { label: string; id: string; count: number }
}

const ACCOUNTS: ClusterAccount[] = [
  {
    id: 'john-doe',
    token: 'c_8hpfrgye4',
    displayName: 'John Doe',
    legalName: 'John A. Doe',
    cashtag: '$johndoe',
    verifiedName: 'John A. Doe',
    accountType: 'Personal',
    verificationType: 'eIDV',
    created: 'Mar 14, 2024',
    npid: 'NPID_123456',
    status: 'ACTIVE',
    verification: 'EIDV',
    extraTags: [],
    avatarLetter: 'C',
    avatarColor: 'bg-red-600',
    holder: { label: 'John Doe (AH)', id: 'AH_jdoe_001', count: 2 },
  },
  {
    id: 'john-doe-llc',
    token: 'c_3kmt7wx92',
    displayName: 'John Doe LLC',
    legalName: 'John Doe LLC',
    cashtag: '$johndoebiz',
    verifiedName: 'John A. Doe (owner)',
    accountType: 'Business',
    verificationType: 'eIDV',
    created: 'Jan 5, 2024',
    npid: 'NPID_123456',
    status: 'ACTIVE',
    verification: 'DIDV',
    extraTags: [],
    avatarLetter: 'B',
    avatarColor: 'bg-blue-600',
    holder: { label: 'John Doe (AH)', id: 'AH_jdoe_001', count: 2 },
  },
  {
    id: 'jon-doe',
    token: 'c_9qnv2pz81',
    displayName: 'Jon Doe',
    legalName: '—',
    cashtag: '$jondoe',
    verifiedName: '—',
    accountType: 'Personal',
    verificationType: 'None',
    created: 'Oct 12, 2024',
    npid: 'NPID_123456',
    status: 'SUSPENDED',
    hideStatus: true,
    verification: 'EIDV',
    extraTags: [
      { label: 'CONFLICTING CIP', color: 'red' },
      { label: 'SUSPENDED', color: 'red' },
    ],
    avatarLetter: 'C',
    avatarColor: 'bg-red-600',
  },
  {
    id: 'j-doe',
    token: 'c_5r1jab34',
    displayName: 'J. Doe',
    legalName: '—',
    cashtag: '$jdoe',
    verifiedName: '—',
    accountType: 'Personal',
    verificationType: 'None',
    created: 'Feb 28, 2025',
    npid: 'NPID_123456',
    status: 'ACTIVE',
    verification: 'NOT VERIFIED',
    extraTags: [
      { label: 'UNVERIFIED', color: 'orange' },
    ],
    avatarLetter: 'C',
    avatarColor: 'bg-red-600',
  },
]

const TX_TILES = [
  { label: '30-Day Volume',          value: '$23,450', sub: 'across 4 accounts' },
  { label: 'Transactions (90d)',      value: '142',     sub: 'avg 35.5 per account' },
  { label: 'Largest Transaction',    value: '$8,200',  sub: 'P2P send · Feb 2026' },
  { label: 'Unique Counterparties',  value: '31',      sub: 'across cluster' },
  { label: 'Shared Counterparties',  value: '4',       sub: 'appear in 2+ accounts' },
  { label: 'Send / Receive (90d)',   value: '61% / 39%', sub: 'of total volume' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function NPIDAccountView({
  selectedId,
  onSelectId,
}: {
  selectedId: string
  onSelectId: (id: string) => void
}) {
  const selected = ACCOUNTS.find(a => a.id === selectedId) ?? ACCOUNTS[0]

  return (
    <div className="space-y-4">
      {/* ── Account View card ─────────────────────────────────────────── */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4">

          {/* Header */}
          <div className="flex items-baseline gap-2 mb-3">
            <h3 className="text-base font-semibold text-zinc-900">Account View</h3>
            <span className="text-sm text-zinc-400">Select an account in the cluster to view details</span>
          </div>

          {/* Account holder row */}
          {selected.holder && (
            <div className="flex items-center gap-2 text-sm mb-3">
              <Users size={14} className="text-brand shrink-0" />
              <span className="font-semibold text-brand">{selected.holder.label}</span>
              <span className="font-mono text-xs text-zinc-400">{selected.holder.id}</span>
              <span className="text-zinc-400 text-xs">
                · {selected.holder.count} accounts · removable as a unit
              </span>
            </div>
          )}

          {/* Account rows */}
          <div className="space-y-2">
            {ACCOUNTS.map(acct => {
              const isSelected = acct.id === selectedId
              return (
                <button
                  key={acct.id}
                  onClick={() => onSelectId(acct.id)}
                  className={clsx(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors',
                    isSelected
                      ? 'border-blue-400 bg-blue-50/40'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  )}
                >
                  {/* Radio */}
                  <div className={clsx(
                    'w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors',
                    isSelected ? 'border-brand' : 'border-zinc-300'
                  )}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-brand" />}
                  </div>

                  {/* Avatar */}
                  <div className={clsx(
                    'w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0',
                    acct.avatarColor
                  )}>
                    {acct.avatarLetter}
                  </div>

                  {/* Token · Name · Cashtag */}
                  <span className="font-mono text-sm text-brand shrink-0">{acct.token}</span>
                  <span className="font-medium text-zinc-900 text-sm shrink-0">{acct.displayName}</span>
                  <span className="text-zinc-400 text-sm shrink-0">{acct.cashtag}</span>

                  {/* Right-side tags */}
                  <div className="ml-auto flex items-center gap-1.5 shrink-0">
                    <Tag>{acct.accountType.toUpperCase()}</Tag>
                    <Tag>{acct.verification}</Tag>
                    {!acct.hideStatus && (
                      <span className={clsx(
                        'text-2xs font-bold uppercase tracking-wide px-1.5 py-0.5 rounded',
                        acct.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : 'text-red-600'
                      )}>
                        {acct.status}
                      </span>
                    )}
                    {acct.extraTags.map(t => (
                      <ExtraTag key={t.label} color={t.color}>{t.label}</ExtraTag>
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Account Details ──────────────────────────────────────────── */}
        <div className="border-t border-zinc-100 px-5 py-4">
          <h3 className="text-base font-semibold text-zinc-900 mb-3">Account Details</h3>

          {/* Inline label-value pairs */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm mb-4">
            <Detail label="Customer Token"    value={selected.token}           teal />
            <Detail label="Display Name"      value={selected.displayName} />
            <Detail label="Legal Name"        value={selected.legalName} />
            <Detail label="Cashtag"           value={selected.cashtag}         teal />
            <Detail label="Verified Name (IDV)" value={selected.verifiedName} />
            <Detail label="Account Type"      value={selected.accountType} />
            <Detail label="Verification Type" value={selected.verificationType} />
            <Detail label="Created"           value={selected.created} />
            <Detail label="Current NPID"      value={selected.npid}            teal />
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 mb-3">
            {['Toolbox', 'Regulator', 'Check TLO', 'Adverse Media', 'Transaction Search'].map(label => (
              <button
                key={label}
                className="px-3 py-1.5 border border-zinc-200 rounded-lg text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Placeholder note */}
          <p className="text-xs text-zinc-400 italic">
            In the live app this surface mounts the standard Notary Account section for{' '}
            <span className="font-mono">{selected.token}</span> — including instruments,
            addresses, alias history, adversity, and comments.
          </p>
        </div>
      </div>

      {/* ── Transaction search card ───────────────────────────────────── */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-100">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Search size={14} className="text-zinc-500 shrink-0" />
              <span className="font-semibold text-zinc-900 text-sm">Transaction search</span>
              <span className="text-zinc-400 text-sm">· preloaded with {ACCOUNTS.length} cluster accounts</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {ACCOUNTS.map(a => (
                <span key={a.id} className="font-mono text-xs text-zinc-500 border border-zinc-200 px-2 py-0.5 rounded">
                  {a.token}
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Filter by date, counterparty, or amount across every account in the cluster.
          </p>
        </div>

        {/* Summary tiles */}
        <div className="px-5 py-4 grid grid-cols-3 gap-3">
          {TX_TILES.map(tile => (
            <div key={tile.label} className="bg-zinc-50 border border-zinc-100 rounded-xl px-4 py-3">
              <div className="text-2xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">
                {tile.label}
              </div>
              <div className="text-xl font-bold text-zinc-900">{tile.value}</div>
              <div className="text-2xs text-zinc-400 mt-0.5">{tile.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Shared primitives ─────────────────────────────────────────────────────────

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-2xs font-medium text-zinc-500 border border-zinc-200 rounded px-1.5 py-0.5 uppercase tracking-wide">
      {children}
    </span>
  )
}

function ExtraTag({ children, color }: { children: React.ReactNode; color: 'red' | 'orange' }) {
  return (
    <span className={clsx(
      'text-2xs font-bold uppercase tracking-wide border rounded px-1.5 py-0.5',
      color === 'red'
        ? 'text-red-600 border-red-200 bg-red-50'
        : 'text-orange-600 border-orange-200 bg-orange-50'
    )}>
      {children}
    </span>
  )
}

function Detail({ label, value, teal }: { label: string; value: string; teal?: boolean }) {
  return (
    <span>
      <span className="font-semibold text-zinc-900">{label}</span>{' '}
      <span className={teal ? 'text-brand font-mono' : 'text-zinc-700'}>{value}</span>
    </span>
  )
}

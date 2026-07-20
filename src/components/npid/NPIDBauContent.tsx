import clsx from 'clsx'
import { AlertTriangle, ArrowRight, BadgeCheck, Shield } from 'lucide-react'
import { SquareCreditCard } from '../evidence/SquareCreditCard'

// ─── Data ─────────────────────────────────────────────────────────────────────

const NPID_ID = 'NPID_123456'

const SPLIT_CLUSTERS = [
  {
    id: 'NPID_200001',
    accounts: [
      { token: 'C_0ew44lyr8', name: 'Jordan Mercer', type: 'Personal' },
      { token: 'C_2mer8k4jo', name: 'J. Mercer',     type: 'Personal' },
    ],
  },
  {
    id: 'NPID_200002',
    accounts: [
      { token: 'C_9mer4kv2p', name: 'Jordan M. Corp', type: 'Business' },
    ],
  },
]

const CHANGES = [
  { op: 'added',   token: 'C_2mer8k4jo', name: 'J. Mercer',      date: 'Feb 3, 2026'  },
  { op: 'removed', token: 'C_9mer4kv2p', name: 'Jordan M. Corp', date: 'Feb 3, 2026'  },
]

interface ScopeAccount {
  token: string
  name: string
  accountType: string
  status: 'Active' | 'Suspended'
  signals: { label: string; color: 'red' | 'orange' | 'blue' }[]
}

const SCOPE_ACCOUNTS: ScopeAccount[] = [
  {
    token: 'C_0ew44lyr8',
    name: 'Jordan Mercer',
    accountType: 'Personal',
    status: 'Active',
    signals: [
      { label: 'CRR: High',   color: 'red'    },
      { label: 'SSN match',   color: 'blue'   },
    ],
  },
  {
    token: 'C_2mer8k4jo',
    name: 'J. Mercer',
    accountType: 'Personal',
    status: 'Active',
    signals: [
      { label: 'Added Feb 2026', color: 'orange' },
      { label: 'SSN match',      color: 'blue'   },
    ],
  },
  {
    token: 'C_k3wmer892',
    name: 'Jordan Mercer LLC',
    accountType: 'Business',
    status: 'Suspended',
    signals: [
      { label: 'Suspended',      color: 'red'    },
      { label: 'Owner IDV',      color: 'blue'   },
    ],
  },
]

const CUSTOMER = {
  token: 'C_0ew44lyr8',
  accountToken: 'AH_8ry144we0',
  name: 'Jordan Mercer',
  legalName: 'Jordan Mercer',
  email: 'j.mercer.wa@protonmail.com',
  phone: '+1 (206) 555-0174',
  joined: 'Mar 4, 2024',
  address: '412 3rd Ave W, Seattle, WA 98119, US',
  crr: 'High',
  cashtag: '$jordanmercer',
  verificationType: 'eIDV',
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NPIDBauContent() {
  return (
    <div className="px-6 pb-64 pt-1 space-y-4">
      {/* ── NPID Header ──────────────────────────────────────────────────── */}
      <div id="assignment-overview" className="bg-white border border-zinc-200 rounded-xl px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-zinc-900 font-mono">{NPID_ID}</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 uppercase tracking-wide">
                CDD – High Risk CRR
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span>
                <span className="font-medium text-zinc-700">Alert date</span>{' '}
                Jan 16, 2026
              </span>
              <span>
                <span className="font-medium text-zinc-700">Created by</span>{' '}
                alert-broker
              </span>
              <span>
                <span className="font-medium text-zinc-700">Case</span>{' '}
                <span className="font-mono text-brand">NTRY_CASE_hUSyoAGVUt</span>
              </span>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-zinc-700 bg-zinc-100 border border-zinc-200 rounded-lg px-3 py-1.5">
            <span className="text-brand font-bold text-sm">3</span>
            <span>accounts in scope</span>
          </div>
        </div>
      </div>

      {/* ── Alert Context ─────────────────────────────────────────────────── */}
      <div id="alert-context" className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100">
          <h3 className="text-base font-semibold text-zinc-900">Alert Context</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Review the NPID split event that triggered this assignment and the resulting cluster structure.
          </p>
        </div>

        {/* NPID split warning */}
        <div className="px-5 pt-4">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertTriangle size={14} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">NPID split detected</p>
              <p className="text-xs text-amber-700 mt-0.5">
                <span className="font-mono font-bold">{NPID_ID}</span> was split by the NPID system into two new clusters.
                Review the account distribution below and confirm the resulting assignments are accurate.
              </p>
            </div>
          </div>
        </div>

        {/* Where accounts went */}
        <div className="px-5 pt-4">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
            Where original accounts are now
          </p>
          <div className="flex items-start gap-3">
            {/* Source */}
            <div className="border border-zinc-200 rounded-lg px-3 py-2.5 bg-zinc-50 text-center shrink-0">
              <div className="text-xs font-mono font-bold text-zinc-700">{NPID_ID}</div>
              <div className="text-2xs text-zinc-400 mt-0.5">original</div>
            </div>

            <div className="flex items-center self-center shrink-0 text-zinc-300">
              <ArrowRight size={14} />
            </div>

            {/* Target clusters */}
            <div className="flex gap-3 flex-wrap">
              {SPLIT_CLUSTERS.map(cluster => (
                <div key={cluster.id} className="border border-blue-200 rounded-lg px-3 py-2.5 bg-blue-50/40 min-w-[180px]">
                  <div className="text-xs font-mono font-bold text-brand mb-1.5">{cluster.id}</div>
                  {cluster.accounts.map(acct => (
                    <div key={acct.token} className="flex items-center gap-1.5 text-2xs text-zinc-600 mb-0.5">
                      <span className="font-mono text-zinc-400">{acct.token}</span>
                      <span className="font-medium">{acct.name}</span>
                      <span className="text-zinc-400">· {acct.type}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Changes since alert creation */}
        <div className="px-5 pt-4">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
            Changes since alert creation
          </p>
          <div className="border border-zinc-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-[70px_130px_1fr_100px] gap-x-3 bg-zinc-50 border-b border-zinc-200 px-4 py-2">
              {['OPERATION', 'TOKEN', 'NAME', 'DATE'].map(h => (
                <span key={h} className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest">{h}</span>
              ))}
            </div>
            {CHANGES.map((row, i) => (
              <div
                key={row.token}
                className={clsx(
                  'grid grid-cols-[70px_130px_1fr_100px] gap-x-3 px-4 py-2.5 items-center text-xs',
                  i < CHANGES.length - 1 && 'border-b border-zinc-100'
                )}
              >
                <span className={clsx(
                  'font-bold uppercase text-2xs tracking-wide px-1.5 py-0.5 rounded w-fit',
                  row.op === 'added'
                    ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                    : 'text-red-600 bg-red-50 border border-red-200'
                )}>
                  {row.op}
                </span>
                <span className="font-mono text-zinc-500">{row.token}</span>
                <span className="font-medium text-zinc-800">{row.name}</span>
                <span className="text-zinc-400 font-mono text-2xs">{row.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accounts in scope table */}
        <div id="accounts-in-scope" className="px-5 pt-4 pb-5">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
            Accounts in Scope
          </p>
          <div className="border border-zinc-200 rounded-xl overflow-hidden">
            <div className="grid grid-cols-[140px_1fr_100px_80px_1fr] gap-x-3 bg-zinc-50 border-b border-zinc-200 px-4 py-2">
              {['C_TOKEN', 'NAME', 'ACCOUNT TYPE', 'STATUS', 'ALERT SIGNALS'].map(h => (
                <span key={h} className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest">{h}</span>
              ))}
            </div>
            {SCOPE_ACCOUNTS.map((acct, i) => (
              <div
                key={acct.token}
                className={clsx(
                  'grid grid-cols-[140px_1fr_100px_80px_1fr] gap-x-3 px-4 py-2.5 items-center',
                  i < SCOPE_ACCOUNTS.length - 1 && 'border-b border-zinc-100',
                  'hover:bg-zinc-50 transition-colors'
                )}
              >
                <span className="font-mono text-xs text-brand">{acct.token}</span>
                <span className="text-sm font-medium text-zinc-900">{acct.name}</span>
                <span className="text-xs text-zinc-600">{acct.accountType}</span>
                <span className={clsx(
                  'text-2xs font-bold uppercase tracking-wide px-1.5 py-0.5 rounded w-fit',
                  acct.status === 'Active'
                    ? 'text-green-700 bg-green-100'
                    : 'text-red-600 bg-red-50'
                )}>
                  {acct.status}
                </span>
                <div className="flex flex-wrap gap-1">
                  {acct.signals.map(sig => (
                    <span key={sig.label} className={clsx(
                      'text-2xs font-medium px-1.5 py-0.5 rounded border uppercase tracking-wide',
                      sig.color === 'red'    && 'text-red-600 bg-red-50 border-red-200',
                      sig.color === 'orange' && 'text-orange-600 bg-orange-50 border-orange-200',
                      sig.color === 'blue'   && 'text-blue-600 bg-blue-50 border-blue-200',
                    )}>
                      {sig.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Customer ──────────────────────────────────────────────────────── */}
      <div id="customer" className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100">
          <h3 className="text-base font-semibold text-zinc-900">Customer</h3>
        </div>

        <div className="px-5 py-4">
          {/* Name + verified */}
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              J
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-semibold text-zinc-900">{CUSTOMER.name}</span>
                <BadgeCheck size={15} className="text-brand" />
                <span className="text-2xs font-bold text-brand uppercase tracking-wide">Verified</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
                <Shield size={11} className="text-zinc-300" />
                <span>CRR: <span className="font-semibold text-red-600">{CUSTOMER.crr}</span></span>
                <span>·</span>
                <span className="font-mono text-zinc-400">{CUSTOMER.accountToken}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 my-3">
            {['Toolbox', 'Regulator', 'Check TLO', 'Adverse Media'].map(label => (
              <button
                key={label}
                className="px-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 hover:bg-zinc-50 transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Detail fields */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <Field label="Customer Token"  value={CUSTOMER.token}           mono />
            <Field label="Legal Name"      value={CUSTOMER.legalName} />
            <Field label="Cashtag"         value={CUSTOMER.cashtag}         mono />
            <Field label="Email"           value={CUSTOMER.email} />
            <Field label="Phone"           value={CUSTOMER.phone} />
            <Field label="Joined"          value={CUSTOMER.joined} />
            <Field label="Address"         value={CUSTOMER.address} />
            <Field label="Verification"    value={CUSTOMER.verificationType} />
          </div>
        </div>
      </div>

      {/* ── Transaction Search placeholder ───────────────────────────────── */}
      <div id="bau-transactions" className="bg-white border border-zinc-200 rounded-xl px-5 py-4">
        <h3 className="text-base font-semibold text-zinc-900 mb-1">Transaction Search</h3>
        <p className="text-xs text-zinc-400">
          Cross-account transaction search for all 3 accounts in scope — coming soon.
        </p>
      </div>

      {/* ── Square Credit Card ───────────────────────────────────────────── */}
      <SquareCreditCard />
    </div>
  )
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <span className="font-semibold text-zinc-900">{label}</span>{' '}
      <span className={mono ? 'font-mono text-brand text-sm' : 'text-zinc-700'}>
        {value}
      </span>
    </div>
  )
}

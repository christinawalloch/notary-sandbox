import { useState } from 'react'
import { X, ChevronDown, ChevronUp, Copy } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type EventType = 'CREATED' | 'MERGED' | 'SPLIT' | 'MEMBERSHIP_UPDATED' | 'MANUAL_CORRECTION'

interface AccountRef { token: string; label: string }
interface PredecessorCluster { npid: string; accounts: AccountRef[] }

interface LineageEvent {
  id: string
  type: EventType
  timestamp: string
  summary: string
  delta: string
  reason: string
  source: string
  runId?: string
  whatChanged: string
  previousCount?: number
  currentCount?: number
  accountsAdded?: AccountRef[]
  accountsRemoved?: AccountRef[]
  movedFrom?: string
  movedTo?: string
  predecessors?: PredecessorCluster[]
  resultingNpid?: string
  initialAccounts?: AccountRef[]
}

// ─── Data ────────────────────────────────────────────────────────────────────
// Uses account names and c-tokens from the current cluster graph.

const LINEAGE_EVENTS: LineageEvent[] = [
  {
    id: 'evt-split-20260527',
    type: 'SPLIT',
    timestamp: 'May 27, 2026 · 4:12 PM',
    summary: 'NPID_123456 split during the May 27 clustering run.',
    delta: '1 account moved to NPID_789012 · 4 accounts remain',
    whatChanged: 'One account was removed from NPID_123456 and placed into a new cluster based on updated identity evidence.',
    previousCount: 5,
    currentCount: 4,
    accountsRemoved: [{ token: 'c_7pqr3st8', label: 'M. Torres' }],
    movedFrom: 'NPID_123456',
    movedTo: 'NPID_789012',
    reason: 'New verified identity data no longer supported grouping this account with the existing cluster.',
    source: 'Customer Resolution model refresh',
    runId: 'run_cr_20260527_0412',
  },
  {
    id: 'evt-merge-20260208',
    type: 'MERGED',
    timestamp: 'Feb 8, 2026 · 6:37 AM',
    summary: 'NPID_098214 and NPID_113902 merged into NPID_123456.',
    delta: '2 predecessor clusters · 5 accounts',
    whatChanged: 'Two predecessor clusters were combined into a single new NPID based on overlapping verified identity signals.',
    currentCount: 5,
    predecessors: [
      {
        npid: 'NPID_098214',
        accounts: [
          { token: 'c_8hpfrgye4', label: 'John Doe' },
          { token: 'c_3kmt7wx92', label: 'John Doe LLC' },
          { token: 'c_7pqr3st8', label: 'M. Torres' },
        ],
      },
      {
        npid: 'NPID_113902',
        accounts: [
          { token: 'c_5rlj8b34', label: 'J. Doe' },
          { token: 'c_9qnv2pz81', label: 'Jon Doe' },
        ],
      },
    ],
    resultingNpid: 'NPID_123456',
    reason: 'New shared verified SSN, device, and bank-account evidence connected the predecessor clusters.',
    source: 'Customer Resolution model refresh',
    runId: 'run_cr_20260208_0637',
  },
  {
    id: 'evt-created-20240314',
    type: 'CREATED',
    timestamp: 'Mar 14, 2024 · 10:22 AM',
    summary: 'NPID_098214 was generated with its initial accounts.',
    delta: '3 accounts · initial cluster',
    whatChanged: 'A new NPID cluster was generated from shared verified identity and device signals.',
    currentCount: 3,
    initialAccounts: [
      { token: 'c_8hpfrgye4', label: 'John Doe' },
      { token: 'c_3kmt7wx92', label: 'John Doe LLC' },
      { token: 'c_7pqr3st8', label: 'M. Torres' },
    ],
    reason: 'Initial clustering run identified shared verified identity and device signals.',
    source: 'Customer Resolution model',
    runId: 'run_cr_20240314_1022',
  },
]

// ─── Badge styles ─────────────────────────────────────────────────────────────

const BADGE: Record<EventType, string> = {
  CREATED:            'bg-emerald-50 text-emerald-700 border border-emerald-200',
  MERGED:             'bg-blue-50 text-blue-700 border border-blue-200',
  SPLIT:              'bg-amber-50 text-amber-700 border border-amber-200',
  MEMBERSHIP_UPDATED: 'bg-zinc-100 text-zinc-600 border border-zinc-200',
  MANUAL_CORRECTION:  'bg-purple-50 text-purple-700 border border-purple-200',
}

const BADGE_LABEL: Record<EventType, string> = {
  CREATED:            'CREATED',
  MERGED:             'MERGED',
  SPLIT:              'SPLIT',
  MEMBERSHIP_UPDATED: 'MEMBERSHIP UPDATED',
  MANUAL_CORRECTION:  'MANUAL CORRECTION',
}

// ─── Chips ────────────────────────────────────────────────────────────────────

function NpidChip({ npid }: { npid: string }) {
  const copy = () => navigator.clipboard?.writeText(npid)
  return (
    <span className="inline-flex items-center gap-1 font-mono text-xs bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded">
      {npid}
      <button onClick={copy} className="text-zinc-400 hover:text-zinc-600 transition-colors" title="Copy">
        <Copy size={9} />
      </button>
    </span>
  )
}

function TokenChip({ token, label }: { token: string; label: string }) {
  const copy = () => navigator.clipboard?.writeText(token)
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded">
      <span className="text-zinc-500">{label}</span>
      <span className="text-zinc-300">·</span>
      <span className="font-mono">{token}</span>
      <button onClick={copy} className="text-zinc-400 hover:text-zinc-600 transition-colors" title="Copy">
        <Copy size={9} />
      </button>
    </span>
  )
}

// ─── Detail row ───────────────────────────────────────────────────────────────

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 text-xs">
      <span className="text-zinc-400 w-40 shrink-0 pt-0.5">{label}</span>
      <div className="text-zinc-700 flex flex-wrap gap-1 min-w-0">{children}</div>
    </div>
  )
}

// ─── Event card ───────────────────────────────────────────────────────────────

function EventCard({ event }: { event: LineageEvent }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-zinc-200 rounded-xl overflow-hidden">
      {/* Collapsed header */}
      <button
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-zinc-50/60 transition-colors"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-2xs font-bold uppercase tracking-wide px-2 py-0.5 rounded ${BADGE[event.type]}`}>
              {BADGE_LABEL[event.type]}
            </span>
            <span className="text-xs text-zinc-400">{event.timestamp}</span>
          </div>
          <p className="text-sm font-medium text-zinc-900 leading-snug">{event.summary}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{event.delta}</p>
        </div>
        <span className="text-zinc-400 shrink-0 mt-1">
          {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </span>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-zinc-100 bg-zinc-50 px-4 py-3 space-y-2">
          <DetailRow label="What changed">{event.whatChanged}</DetailRow>

          {event.previousCount !== undefined && (
            <DetailRow label="Previous account count">{event.previousCount}</DetailRow>
          )}
          {event.currentCount !== undefined && (
            <DetailRow label="Current account count">{event.currentCount}</DetailRow>
          )}

          {event.accountsRemoved && event.accountsRemoved.length > 0 && (
            <DetailRow label="Account removed">
              {event.accountsRemoved.map(a => <TokenChip key={a.token} token={a.token} label={a.label} />)}
            </DetailRow>
          )}
          {event.accountsAdded && event.accountsAdded.length > 0 && (
            <DetailRow label="Accounts added">
              {event.accountsAdded.map(a => <TokenChip key={a.token} token={a.token} label={a.label} />)}
            </DetailRow>
          )}

          {event.movedFrom && (
            <DetailRow label="Moved from"><NpidChip npid={event.movedFrom} /></DetailRow>
          )}
          {event.movedTo && (
            <DetailRow label="Moved to"><NpidChip npid={event.movedTo} /></DetailRow>
          )}

          {event.predecessors && event.predecessors.map((p, i) => (
            <DetailRow key={p.npid} label={`Predecessor ${i + 1}`}>
              <div className="space-y-1.5">
                <div><NpidChip npid={p.npid} /></div>
                <div className="flex flex-wrap gap-1">
                  {p.accounts.map(a => <TokenChip key={a.token} token={a.token} label={a.label} />)}
                </div>
              </div>
            </DetailRow>
          ))}

          {event.resultingNpid && (
            <DetailRow label="Resulting NPID"><NpidChip npid={event.resultingNpid} /></DetailRow>
          )}

          {event.initialAccounts && event.initialAccounts.length > 0 && (
            <DetailRow label="Initial accounts">
              <div className="flex flex-wrap gap-1">
                {event.initialAccounts.map(a => <TokenChip key={a.token} token={a.token} label={a.label} />)}
              </div>
            </DetailRow>
          )}

          <DetailRow label="Reason">{event.reason}</DetailRow>
          <DetailRow label="Source">{event.source}</DetailRow>
          {event.runId && (
            <DetailRow label="Run ID">
              <span className="font-mono text-zinc-400">{event.runId}</span>
            </DetailRow>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function NPIDLineageModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: 660, maxHeight: '82vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-zinc-900 mb-1">NPID lineage</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs">
                <span>
                  <span className="font-medium text-zinc-900">Current NPID</span>{' '}
                  <span className="font-mono text-zinc-500">NPID_123456</span>
                </span>
                <span>
                  <span className="font-medium text-zinc-900">Current membership</span>{' '}
                  <span className="text-zinc-500">4 accounts</span>
                </span>
                <span>
                  <span className="font-medium text-zinc-900">Latest clustering run</span>{' '}
                  <span className="text-zinc-500">May 27, 2026 · 4:12 PM</span>
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                Review how this identity cluster was created and changed across clustering runs.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-700 transition-colors shrink-0 mt-0.5"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Event list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {LINEAGE_EVENTS.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  )
}

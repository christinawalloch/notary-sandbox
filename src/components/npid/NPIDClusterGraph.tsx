import { useState } from 'react'
import clsx from 'clsx'
import { Maximize2, Copy, ExternalLink, X, Link2, User } from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────

interface GraphNode {
  id: string
  label: string
  token: string
  type: 'personal' | 'business'
  cx: number
  cy: number
  inCluster: boolean
  status: 'active' | 'suspended'
  holder?: string
  accountCount?: number
  // external = connected via a shared signal but belongs to a different NPID or none
  external?: boolean
  externalNpid?: string
  controlSignal?: string  // signal key that gates this external node's visibility
}

const NODES: GraphNode[] = [
  // ── Accounts inside NPID_123456 ──────────────────────────────────────────────
  { id: 'john-doe',     label: 'John Doe',    token: 'c_8hpfrgye4', type: 'personal', cx: 400, cy: 105, inCluster: true,  status: 'active',    holder: 'AH_jdoe_001', accountCount: 2 },
  { id: 'j-doe',        label: 'J. Doe',       token: 'c_5rlj8b34',  type: 'personal', cx: 190, cy: 355, inCluster: false, status: 'active' },
  { id: 'john-doe-llc', label: 'John Doe LLC', token: 'c_3kmt7wx92', type: 'business', cx: 625, cy: 360, inCluster: false, status: 'active' },
  { id: 'jon-doe',      label: 'Jon Doe',      token: 'c_9qnv2pz81', type: 'personal', cx: 400, cy: 500, inCluster: false, status: 'suspended' },
  // ── External: connected via shared signal, outside NPID_123456 ───────────────
  { id: 'torres', label: 'M. Torres', token: 'c_7pqr3st8', type: 'personal', cx: 658, cy: 148, inCluster: false, status: 'active',    external: true, externalNpid: 'NPID_789012', controlSignal: 'bank-account' },
  { id: 'kim',    label: 'D. Kim',    token: 'c_2xyz9ab1', type: 'personal', cx: 135, cy: 148, inCluster: false, status: 'active',    external: true, externalNpid: undefined,      controlSignal: 'cash-device'  },
]

const SIGNALS = [
  { id: 'cash-device',  label: 'Cash device',  cx: 305, cy: 218, color: '#3b82f6' },
  { id: 'verified-ssn', label: 'Verified SSN', cx: 515, cy: 218, color: '#f59e0b' },
  { id: 'bank-account', label: 'Bank account', cx: 558, cy: 308, color: '#22c55e' },
  { id: 'payment-card', label: 'Payment card', cx: 360, cy: 420, color: '#a855f7' },
]

interface Edge {
  x1: number; y1: number; x2: number; y2: number
  dashed?: boolean
  signal?: string    // hides when this signal toggle is off
  fromNode?: string  // hides when this node's type is toggled off
  toNode?: string    // hides when this node's type is toggled off
  color?: string
  strokeWidth?: number
}

// Hex at (400, 315), r=55
const HEX_CX = 400, HEX_CY = 315, HEX_R = 55
function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`
  }).join(' ')
}
function triPoints(cx: number, cy: number, r = 18) {
  return `${cx},${cy - r} ${cx - r * 0.87},${cy + r * 0.5} ${cx + r * 0.87},${cy + r * 0.5}`
}
function pentPoints(cx: number, cy: number, r = 18) {
  return Array.from({ length: 5 }, (_, i) => {
    const a = (2 * Math.PI * i) / 5 - Math.PI / 2
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`
  }).join(' ')
}

const EDGES: Edge[] = [
  { x1: 400, y1: 124, x2: 305, y2: 210, signal: 'cash-device',  fromNode: 'john-doe' },
  { x1: 400, y1: 124, x2: 515, y2: 210, signal: 'verified-ssn', fromNode: 'john-doe' },
  { x1: 305, y1: 226, x2: 362, y2: 295, signal: 'cash-device' },
  { x1: 515, y1: 226, x2: 558, y2: 300, signal: 'verified-ssn' },
  { x1: 558, y1: 316, x2: 453, y2: 308, signal: 'bank-account' },
  { x1: 360, y1: 412, x2: 380, y2: 366, signal: 'payment-card' },
  // dashed to outer nodes
  { x1: 354, y1: 308, x2: 207, y2: 350, dashed: true, toNode: 'j-doe' },
  { x1: 450, y1: 310, x2: 608, y2: 358, dashed: true, toNode: 'john-doe-llc' },
  { x1: 400, y1: 372, x2: 400, y2: 487, dashed: true, toNode: 'jon-doe' },
  { x1: 360, y1: 428, x2: 203, y2: 352, signal: 'payment-card', toNode: 'j-doe' },
  // Account holder: john-doe ↔ john-doe-llc share AH_jdoe_001
  { x1: 400, y1: 105, x2: 625, y2: 360, signal: 'account-holder', fromNode: 'john-doe', toNode: 'john-doe-llc', color: '#22c55e', strokeWidth: 2 },
  // External: M. Torres shares bank account → connected to bank-account signal dot
  { x1: 558, y1: 300, x2: 651, y2: 158, signal: 'bank-account', toNode: 'torres', dashed: true },
  // External: D. Kim shares cash device → connected to cash-device signal dot
  { x1: 298, y1: 212, x2: 142, y2: 155, signal: 'cash-device',  toNode: 'kim',    dashed: true },
]

const ACCOUNT_DETAILS: Record<string, {
  cashtag: string; type: string; verification: string; created: string;
  state: string; status: string; verifiedName: string; legalName: string; holder?: string
}> = {
  'john-doe':     { cashtag: '$johndoe',  type: 'Personal', verification: 'eIDV', created: 'Mar 14, 2024', state: 'Verified',     status: 'Active',    verifiedName: 'John A. Doe',         legalName: 'John A. Doe',    holder: 'AH_jdoe_001' },
  'j-doe':        { cashtag: '$j.doe34',  type: 'Personal', verification: 'None', created: 'Feb 28, 2025', state: 'Not verified', status: 'Active',    verifiedName: '—',                   legalName: '—' },
  'john-doe-llc': { cashtag: '$jdoellc',  type: 'Business', verification: 'eIDV', created: 'Jan 5, 2024',  state: 'Verified',     status: 'Active',    verifiedName: 'John A. Doe (owner)', legalName: 'John Doe LLC' },
  'jon-doe':      { cashtag: '$jondoe8',  type: 'Personal', verification: 'None', created: 'Oct 12, 2024', state: 'Not verified', status: 'Suspended', verifiedName: '—',                   legalName: '—' },
  'torres':       { cashtag: '$mtorres',  type: 'Personal', verification: 'eIDV', created: 'Nov 3, 2023',  state: 'Verified',     status: 'Active',    verifiedName: 'Maria A. Torres',     legalName: 'Maria A. Torres' },
  'kim':          { cashtag: '$dkim',     type: 'Personal', verification: 'None', created: 'Jun 15, 2025', state: 'Not verified', status: 'Active',    verifiedName: '—',                   legalName: '—' },
}

// ─── Main component ───────────────────────────────────────────────────────────

const DEFAULT_ACCOUNT_TYPES = { personal: true, business: false }
const SIGNAL_CONFIGS = [
  { key: 'account-holder', label: 'Account holder', color: '#22c55e', defaultOn: true  },
  { key: 'verified-ssn',    label: 'Verified SSN',    color: '#f59e0b', defaultOn: true  },
  { key: 'cash-device',     label: 'Cash device',     color: '#3b82f6', defaultOn: true  },
  { key: 'cash-backup-tag', label: 'Cash backup tag', color: '#06b6d4', defaultOn: true  },
  { key: 'payment-card',    label: 'Payment card',    color: '#a855f7', defaultOn: false },
  { key: 'tracking-cookie', label: 'Tracking cookie', color: '#374151', defaultOn: false },
  { key: 'phone-number',    label: 'Phone number',    color: '#92400e', defaultOn: false },
  { key: 'bank-account',    label: 'Bank account',    color: '#22c55e', defaultOn: true  },
  { key: 'email',           label: 'Email',           color: '#ec4899', defaultOn: false },
] as const
type SignalKey = typeof SIGNAL_CONFIGS[number]['key']
const DEFAULT_SIGNALS = Object.fromEntries(SIGNAL_CONFIGS.map(s => [s.key, s.defaultOn])) as Record<SignalKey, boolean>

export function NPIDClusterGraph({
  markedIds,
  onMark,
  selectedId,
  onSelectId,
}: {
  markedIds: Set<string>
  onMark: (id: string, reason: string) => void
  selectedId: string
  onSelectId: (id: string) => void
}) {
  const [pinnedIds, setPinnedIds] = useState<string[]>([])
  const [unclusteringNode, setUnclusteringNode] = useState<string | null>(null)
  const [unclusteringReason, setUnclusteringReason] = useState('')
  const [accountTypes, setAccountTypes] = useState({ ...DEFAULT_ACCOUNT_TYPES })
  const [signals, setSignals] = useState<Record<SignalKey, boolean>>({ ...DEFAULT_SIGNALS })

  const resetLegend = () => { setAccountTypes({ ...DEFAULT_ACCOUNT_TYPES }); setSignals({ ...DEFAULT_SIGNALS }) }
  const clearLegend = () => {
    setAccountTypes({ personal: false, business: false })
    setSignals(Object.fromEntries(SIGNAL_CONFIGS.map(s => [s.key, false])) as Record<SignalKey, boolean>)
  }

  const nodeVisible = (node: GraphNode) => {
    const typeOn = node.type === 'personal' ? accountTypes.personal : accountTypes.business
    if (!typeOn) return false
    if (node.external && node.controlSignal) return signals[node.controlSignal as SignalKey]
    return true
  }

  const edgeVisible = (e: Edge) => {
    if (e.signal && !signals[e.signal as SignalKey]) return false
    if (e.fromNode) { const n = NODES.find(x => x.id === e.fromNode); if (n && !nodeVisible(n)) return false }
    if (e.toNode)   { const n = NODES.find(x => x.id === e.toNode);   if (n && !nodeVisible(n)) return false }
    return true
  }

  const selectedNode = NODES.find(n => n.id === selectedId) ?? null
  const pinnedNodes = NODES.filter(n => pinnedIds.includes(n.id))

  const pinNode = (id: string) => {
    if (!pinnedIds.includes(id) && pinnedIds.length < 4) setPinnedIds(prev => [...prev, id])
  }
  const unpinNode = (id: string) => setPinnedIds(prev => prev.filter(x => x !== id))

  const confirmMark = () => {
    if (!unclusteringNode) return
    onMark(unclusteringNode, unclusteringReason)
    setUnclusteringNode(null)
    setUnclusteringReason('')
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-5 px-5 py-3 border-b border-zinc-100">
        <h3 className="text-base font-semibold text-zinc-900 shrink-0">NPID Cluster Graph</h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-zinc-500">
            <span className="font-medium text-zinc-700">Latest clustering run</span>
            May 27, 2026 at 4:12 pm
          </span>
          <span className="text-zinc-300">|</span>
          <button className="text-brand font-medium hover:underline">
            Cluster history (3)
          </button>
        </div>
      </div>

      {/* Graph area */}
      <div className="flex" style={{ height: 420 }}>
        {/* Legend */}
        <div className="w-52 shrink-0 border-r border-zinc-100 p-4 overflow-y-auto bg-zinc-50">
          <LegendSection title="Node Shapes">
            <LegendShape label="Personal account" shape="triangle" />
            <LegendShape label="Business account" shape="pentagon" />
            <LegendShape label="NPID cluster" shape="hexagon" />
            <LegendShape label="External account" shape="ext-triangle" color="#9ca3af" />
            <LegendShape label="Shared signal" shape="dot" color="#9ca3af" />
          </LegendSection>

          <div className="flex gap-2 mt-3 mb-4">
            <button onClick={resetLegend} className="px-3 py-1 text-2xs border border-zinc-200 rounded text-zinc-500 hover:bg-zinc-50">Reset</button>
            <button onClick={clearLegend} className="px-3 py-1 text-2xs border border-zinc-200 rounded text-zinc-500 hover:bg-zinc-50">Clear</button>
          </div>

          <LegendSection title="Account Types">
            <Toggle label="Personal account" on={accountTypes.personal} onChange={v => setAccountTypes(p => ({ ...p, personal: v }))} />
            <Toggle label="Business account" on={accountTypes.business} onChange={v => setAccountTypes(p => ({ ...p, business: v }))} />
          </LegendSection>

          <LegendSection title="Signal Layer">
            {SIGNAL_CONFIGS.map(s => (
              <Toggle key={s.key} label={s.label} color={s.color} on={signals[s.key]} onChange={v => setSignals(p => ({ ...p, [s.key]: v }))} />
            ))}
          </LegendSection>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative bg-zinc-50 overflow-hidden">
          <div className="absolute top-3 left-4 text-xs font-semibold text-brand tracking-wide">
            CLUSTER UNDER REVIEW · NPID_123456
          </div>
          <button className="absolute top-3 right-4 flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 border border-zinc-200 px-2 py-1 rounded bg-white">
            <Maximize2 size={11} /> Fullscreen
          </button>

          <svg
            viewBox="10 45 780 520"
            className="w-full h-full"
          >
            {/* Dashed boundary circle */}
            <circle cx={HEX_CX} cy={HEX_CY} r={215} fill="none" stroke="#d1d5db" strokeWidth={1.5} strokeDasharray="6 4" />

            {/* Edges */}
            {EDGES.filter(edgeVisible).map((e, i) => (
              <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke={e.color ?? '#d1d5db'}
                strokeWidth={e.strokeWidth ?? 1}
                strokeDasharray={e.dashed ? '4 3' : undefined}
              />
            ))}

            {/* Signal dots */}
            {SIGNALS.filter(s => signals[s.id as SignalKey]).map(s => (
              <g key={s.id}>
                <circle cx={s.cx} cy={s.cy} r={7} fill={s.color} />
                <text x={s.cx} y={s.cy + 18} textAnchor="middle" fontSize={10} fill="#6b7280">{s.label}</text>
              </g>
            ))}

            {/* NPID hexagon */}
            <polygon
              points={hexPoints(HEX_CX, HEX_CY, HEX_R)}
              fill="#5eead4"
              stroke="#0d9488"
              strokeWidth={2}
            />
            <text x={HEX_CX} y={HEX_CY - 6} textAnchor="middle" fontSize={9} fontWeight={700} fill="#0f766e" letterSpacing={1}>NPID CLUSTER</text>
            <text x={HEX_CX} y={HEX_CY + 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="#134e4a">NPID_123456</text>
            <text x={HEX_CX} y={HEX_CY + 22} textAnchor="middle" fontSize={9} fill="#0f766e">4 accounts</text>

            {/* Account nodes — external nodes rendered first so NPID nodes sit on top */}
            {[...NODES.filter(n => n.external && nodeVisible(n)), ...NODES.filter(n => !n.external && nodeVisible(n))].map(node => {
              const isSelected = node.id === selectedId
              const isMarked = markedIds.has(node.id)
              const isExternal = !!node.external
              const opacity = isSelected ? 1 : isExternal ? 0.6 : 0.35
              const nodeColor = isExternal ? '#f9fafb' : node.status === 'suspended' ? '#fca5a5' : node.inCluster ? '#ffffff' : '#f3f4f6'
              const strokeColor = isMarked ? '#f97316' : isSelected ? '#12B76A' : isExternal ? '#9ca3af' : node.status === 'suspended' ? '#f87171' : '#9ca3af'
              const shapeDash = isExternal && !isSelected ? '4 2' : undefined

              return (
                <g key={node.id} style={{ opacity }} className="cursor-pointer" onClick={() => onSelectId(node.id)}>
                  {isSelected && (
                    <circle cx={node.cx} cy={node.cy} r={30} fill="none"
                      stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="5 3" />
                  )}
                  {node.type === 'personal' ? (
                    <polygon points={triPoints(node.cx, node.cy)} fill={nodeColor} stroke={strokeColor} strokeWidth={isSelected ? 2 : 1.5} strokeDasharray={shapeDash} />
                  ) : (
                    <polygon points={pentPoints(node.cx, node.cy)} fill={nodeColor} stroke={strokeColor} strokeWidth={isSelected ? 2 : 1.5} strokeDasharray={shapeDash} />
                  )}
                  <text x={node.cx} y={node.cy + 32} textAnchor="middle" fontSize={10} fontWeight={600} fill={isSelected ? '#111827' : isExternal ? '#9ca3af' : '#374151'}>
                    {node.label}
                  </text>
                  <text x={node.cx} y={node.cy + 44} textAnchor="middle" fontSize={9} fill="#9ca3af">
                    {node.token}
                  </text>
                  {isExternal && (
                    <text x={node.cx} y={node.cy + 56} textAnchor="middle" fontSize={8} fill="#9ca3af" fontStyle="italic">
                      {node.externalNpid ?? 'No NPID'}
                    </text>
                  )}
                  {isMarked && (
                    <text x={node.cx} y={node.cy - 26} textAnchor="middle" fontSize={8} fill="#ea580c" fontWeight={700}>MARKED</text>
                  )}
                </g>
              )
            })}
          </svg>

          <div className="absolute bottom-2 left-4 text-2xs text-zinc-400">
            Static layout · prod uses d3-force
          </div>
        </div>

        {/* Account panel (right) */}
        {selectedNode && (
          <AccountPanel
            node={selectedNode}
            detail={ACCOUNT_DETAILS[selectedNode.id]}
            isMarked={markedIds.has(selectedNode.id)}
            showingUnclustering={unclusteringNode === selectedNode.id}
            unclusteringReason={unclusteringReason}
            onUnclusteringReasonChange={setUnclusteringReason}
            onPin={() => pinNode(selectedNode.id)}
            onMarkClick={() => setUnclusteringNode(selectedNode.id)}
            onCancelMark={() => setUnclusteringNode(null)}
            onConfirmMark={confirmMark}
            isPinned={pinnedIds.includes(selectedNode.id)}
          />
        )}
      </div>

      {/* Pinned for comparison */}
      <div className="border-t border-zinc-100">
        <div className="flex items-center justify-between px-5 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Pinned for Comparison</span>
            {pinnedIds.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-600 text-2xs font-bold flex items-center justify-center">
                {pinnedIds.length}
              </span>
            )}
          </div>
          {pinnedIds.length > 0 && (
            <button onClick={() => setPinnedIds([])} className="text-xs text-zinc-500 hover:text-zinc-800">
              Unpin all
            </button>
          )}
        </div>

        <div className="px-5 pb-4 grid gap-3" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {pinnedNodes.map(node => {
            const d = ACCOUNT_DETAILS[node.id]
            return (
              <div key={node.id} className="border border-zinc-200 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="text-sm font-bold text-zinc-900">{node.label}</div>
                    <div className="text-xs font-mono text-zinc-400">{node.token}</div>
                  </div>
                  <button
                    onClick={() => unpinNode(node.id)}
                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 border border-zinc-200 px-2 py-1 rounded shrink-0"
                  >
                    <X size={10} /> Unpin
                  </button>
                </div>
                {d && (
                  <div className="space-y-1.5 text-xs">
                    {([
                      ['Cashtag', d.cashtag],
                      ['Type', d.type],
                      ['Verification', d.verification],
                      ['Created', d.created],
                      ['State', d.state],
                      ['Status', d.status],
                      ['Verified name', d.verifiedName],
                      ...(d.holder ? [['Holder', d.holder]] : []),
                    ] as [string, string][]).map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[100px_1fr]">
                        <span className="text-zinc-500">{k}</span>
                        <span className="font-medium text-zinc-900">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* Empty slot (shown when under 4 pins) */}
          {pinnedIds.length < 4 && (
            <div className="border border-dashed border-zinc-200 rounded-xl flex items-center justify-center bg-zinc-50 text-xs text-zinc-400 text-center px-4 py-5">
              Pin an account to compare
            </div>
          )}
        </div>
      </div>

      {/* Footer note */}
      <div className="border-t border-zinc-100 px-5 py-2.5 flex items-center gap-2 text-2xs text-zinc-400">
        <span className="w-4 h-4 rounded-full border border-zinc-300 flex items-center justify-center text-[9px] shrink-0">i</span>
        Marking an account for unclustering only adds it to the review list. Cluster changes are submitted from the decision panel and require L2 approval.
      </div>
    </div>
  )
}

// ─── Account panel ─────────────────────────────────────────────────────────────

function AccountPanel({
  node, detail, isMarked, showingUnclustering, unclusteringReason,
  onUnclusteringReasonChange, onPin, onMarkClick, onCancelMark, onConfirmMark, isPinned,
}: {
  node: GraphNode
  detail: typeof ACCOUNT_DETAILS[string]
  isMarked: boolean
  showingUnclustering: boolean
  unclusteringReason: string
  onUnclusteringReasonChange: (v: string) => void
  onPin: () => void
  onMarkClick: () => void
  onCancelMark: () => void
  onConfirmMark: () => void
  isPinned: boolean
}) {
  const typeLabel = node.external
    ? 'Connected outside NPID'
    : node.type === 'business' ? 'Business Account' : 'Personal Account'

  return (
    <div className="w-[340px] shrink-0 border-l border-zinc-100 bg-white overflow-y-auto">
      {/* Header area */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="inline-block bg-zinc-100 text-zinc-500 text-2xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md">
            {typeLabel}
          </span>
          {isMarked && !node.external && (
            <span className="text-2xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md whitespace-nowrap">
              Marked for removal
            </span>
          )}
        </div>
        <div className="text-xl font-bold text-zinc-900 leading-tight mb-1">{node.label}</div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-400">
          <span className="font-mono">{node.token}</span>
          <button className="flex items-center gap-0.5 hover:text-zinc-600 transition-colors">
            <Copy size={11} /> Copy
          </button>
        </div>
      </div>

      <div className="border-t border-zinc-100" />

      {/* Detail rows */}
      <div className="px-4 py-1">
        {!node.external && detail && (
          <div className="divide-y divide-zinc-50">
            {([
              ['Cashtag',              detail.cashtag],
              ['Account name',         node.label],
              ['Legal name',           detail.legalName],
              ['Verified name (IDV)',  detail.verifiedName],
              ['Account type',         detail.type],
              ['Verification type',    detail.verification],
              ['Account created',      detail.created],
              ['Account state',        detail.state],
              ['Account status',       detail.status],
              ['Current NPID',         'NPID_123456'],
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-2 gap-4">
                <span className="text-xs text-zinc-400 shrink-0">{label}</span>
                <span className={clsx(
                  'text-xs font-medium text-right',
                  label === 'Account status' && value === 'Suspended' ? 'text-red-600' : 'text-zinc-900'
                )}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {node.external && (
          <div className="py-3">
            <div className="text-xs text-zinc-400 mb-2">
              {node.external ? 'Associated NPID' : 'Current NPID'}
            </div>
            <div className="text-xs font-medium text-zinc-900 font-mono mb-3">
              {node.externalNpid ?? 'No associated NPID'}
            </div>
            <div className="text-xs text-zinc-400 mb-2">Connected to NPID_123456 via</div>
            {node.controlSignal && (() => {
              const sig = SIGNAL_CONFIGS.find(s => s.key === node.controlSignal)
              return sig ? (
                <div className="flex items-center gap-2 bg-zinc-50 rounded-lg px-2.5 py-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: sig.color }} />
                  <span className="text-xs font-medium text-zinc-700">{sig.label}</span>
                </div>
              ) : null
            })()}
          </div>
        )}
      </div>

      {/* Account holder warning */}
      {!node.external && node.holder && (
        <div className="mx-4 mb-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-amber-800 mb-1">
            <User size={13} className="text-amber-500 shrink-0" />
            Account holder <span className="font-mono">{node.holder}</span>
          </div>
          <p className="text-amber-700 leading-relaxed">
            {node.label} (AH) owns {node.accountCount} accounts.{' '}
            <strong>The whole holder must be unclustered as a unit</strong> — individual accounts cannot be removed separately.
          </p>
        </div>
      )}

      <div className="border-t border-zinc-100 mx-4" />

      {/* Actions */}
      <div className="mb-3">
        <div className="text-2xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Actions</div>
        <div className="flex gap-2">
          <button
            onClick={onPin}
            className={clsx(
              'flex-1 flex items-center gap-2 px-3 py-3 rounded-xl border text-sm transition-colors whitespace-nowrap',
              isPinned
                ? 'border-zinc-900 bg-white text-zinc-900 font-semibold'
                : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100'
            )}
          >
            <Link2 size={14} className="shrink-0" />
            {isPinned ? 'Pinned' : 'Pin for comparison'}
          </button>
          <button className="shrink-0 flex items-center gap-2 px-3 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 text-sm hover:bg-zinc-100 transition-colors whitespace-nowrap">
            <ExternalLink size={14} className="shrink-0" /> Open Toolbox
          </button>
        </div>
      </div>

      {/* Mark button — external accounts are never candidates */}
      {!node.external && !isMarked && (
        <button
          onClick={onMarkClick}
          className={clsx(
            'w-full py-3 border font-medium rounded-xl transition-colors text-sm',
            showingUnclustering
              ? 'bg-red-50 border-red-400 text-red-600'
              : 'bg-red-50 border-red-300 text-red-600 hover:border-red-400'
          )}
        >
          Mark account holder for unclustering
        </button>
      )}

      {!node.external && showingUnclustering && (
        <div className="mt-2 bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
          <div className="text-2xs font-semibold text-red-600 uppercase tracking-wide">Unclustering Reason</div>
          <select
            value={unclusteringReason}
            onChange={e => onUnclusteringReasonChange(e.target.value)}
            className="w-full text-sm border border-red-300 rounded-xl px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-red-200"
          >
            <option value="">Select a reason...</option>
            <option>Different natural person</option>
            <option>Business account — not a natural person</option>
            <option>Insufficient linking evidence</option>
            <option>CIP data conflict</option>
            <option>Analyst error in prior clustering</option>
          </select>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Marking for unclustering adds this to the decision panel's review list. You can change the reason there before submission.
          </p>
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={onCancelMark}
              className="px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-700 hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmMark}
              className="px-4 py-2 bg-red-200 rounded-xl text-sm text-red-700 font-medium hover:bg-red-300 transition-colors"
            >
              Mark
            </button>
          </div>
        </div>
      )}

      {!node.external && isMarked && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 text-xs text-orange-700">
          Added to decision panel review list.
        </div>
      )}

      {node.external && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-500 leading-relaxed">
          This account is outside NPID_123456. It cannot be marked for unclustering here — investigate it separately if needed.
        </div>
      )}
    </div>
  )
}

// ─── Legend helpers ────────────────────────────────────────────────────────────

function LegendSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-2xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">{title}</div>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

function LegendShape({ label, shape, color = '#6b7280' }: { label: string; shape: string; color?: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-600">
      <svg width={16} height={14} viewBox="0 0 16 14">
        {shape === 'triangle' && <polygon points="8,1 1,13 15,13" fill="none" stroke={color} strokeWidth={1.5} />}
        {shape === 'ext-triangle' && <polygon points="8,1 1,13 15,13" fill="none" stroke={color} strokeWidth={1.5} strokeDasharray="3 1.5" />}
        {shape === 'pentagon' && <polygon points="8,1 15,6 12,13 4,13 1,6" fill="none" stroke={color} strokeWidth={1.5} />}
        {shape === 'hexagon' && <polygon points="8,1 14,4.5 14,9.5 8,13 2,9.5 2,4.5" fill="#5eead4" stroke="#0d9488" strokeWidth={1.5} />}
        {shape === 'dot' && <circle cx={8} cy={7} r={4} fill={color} />}
      </svg>
      {label}
    </div>
  )
}

function Toggle({ label, on, onChange, color }: { label: string; on: boolean; onChange: (v: boolean) => void; color?: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-600">
      <button
        onClick={() => onChange(!on)}
        className={clsx(
          'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200',
          on ? 'bg-brand' : 'bg-zinc-300'
        )}
        style={on && color ? { backgroundColor: color } : undefined}
      >
        <span className={clsx(
          'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
          on ? 'translate-x-4' : 'translate-x-0'
        )} />
      </button>
      {label}
    </div>
  )
}

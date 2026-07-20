import { useState } from 'react'
import { X, ChevronUp, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'

const STEPS = [
  { id: 'confirm-cluster', label: 'Disposition' },
  { id: 'remove-accounts', label: 'Remove' },
  { id: 'review-submit', label: 'Submit' },
]

const UNCLUSTERING_REASONS = [
  'Clustering error',
  'Different natural person',
  'Business account — not a natural person',
  'Insufficient linking evidence',
  'CIP data conflict',
  'Analyst error in prior clustering',
]

const HOLDER_UNIT = {
  id: 'AH_jdoe_001',
  label: 'John Doe (AH)',
  accounts: [
    { name: 'John Doe',     token: 'c_8hpfrgye4', type: 'PERSONAL', verification: 'EIDV', status: 'ACTIVE' },
    { name: 'John Doe LLC', token: 'c_3kmt7wx92', type: 'BUSINESS', verification: 'DIDV', status: 'ACTIVE' },
  ],
}

const SINGLETONS = [
  { id: 'jon-doe', name: 'Jon Doe', token: 'c_9qnv2pz81', type: 'PERSONAL', verification: 'EIDV',         status: 'SUSPENDED' },
  { id: 'j-doe',   name: 'J. Doe',  token: 'c_5r1jab34',  type: 'PERSONAL', verification: 'NOT VERIFIED', status: 'ACTIVE'    },
]

const DEFAULT_HOLDER_COMMENT = 'Verified identity data for this account holder conflicts with the remaining cluster. The shared device signal alone is insufficient to support continued grouping.'
const DEFAULT_NOTES = 'The reviewed cluster contains conflicting verified identity data. John Doe and John Doe LLC belong to the same account holder and must be removed together. Their verified identity information does not match the remaining cluster, and the shared device signal is insufficient to establish operation by one natural person. Submit the proposed account-holder removal for L2 approval.'

interface NPIDDecisionPanelProps {
  onClose: () => void
  markedIds: Set<string>
  markReasons: Record<string, string>
}

export function NPIDDecisionPanel({ onClose, markedIds, markReasons }: NPIDDecisionPanelProps) {
  const [stepId, setStepId] = useState('confirm-cluster')
  const activeIdx = STEPS.findIndex(s => s.id === stepId)

  const holderNodeIds = ['john-doe', 'john-doe-llc']
  const holderInitReason = holderNodeIds.map(id => markReasons[id]).find(Boolean) ?? 'Clustering error'

  // Step 2 state lifted to panel so Step 3 can read it
  const [holderChecked, setHolderChecked] = useState(true)
  const [holderReason, setHolderReason] = useState(holderInitReason)
  const [holderComment, setHolderComment] = useState(DEFAULT_HOLDER_COMMENT)
  const [singletonSelected, setSingletonSelected] = useState<Set<string>>(
    () => new Set(SINGLETONS.filter(s => markedIds.has(s.id)).map(s => s.id))
  )
  const [singletonReasons, setSingletonReasons] = useState<Record<string, string>>(
    () => Object.fromEntries(SINGLETONS.filter(s => markReasons[s.id]).map(s => [s.id, markReasons[s.id]]))
  )
  const [singletonComments, setSingletonComments] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState(DEFAULT_NOTES)
  const [summaryOpen, setSummaryOpen] = useState(false)

  const isSubmitStep = stepId === 'review-submit'

  const goNext = () => {
    if (activeIdx < STEPS.length - 1) {
      const nextId = STEPS[activeIdx + 1].id
      setStepId(nextId)
      if (nextId === 'review-submit') setSummaryOpen(true)
    }
  }
  const goBack = () => { if (activeIdx > 0) setStepId(STEPS[activeIdx - 1].id) }

  return (
    <div className="w-[500px] shrink-0 border-l border-zinc-200 bg-white flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-zinc-100">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-base font-bold text-zinc-900">Cluster Verification</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              NPID_123456
              <span className="mx-1.5 text-zinc-300">·</span>
              4 accounts
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-x-1.5 mt-3 flex-wrap gap-y-1.5">
          {STEPS.map((step, idx) => {
            const active = step.id === stepId
            const done = idx < activeIdx
            const future = idx > activeIdx
            return (
              <div key={step.id} className="flex items-center gap-1.5">
                <button
                  onClick={() => done && setStepId(step.id)}
                  className={clsx(
                    'px-3 py-1 rounded-full text-2xs font-bold tracking-widest uppercase transition-colors border',
                    active
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : done
                        ? 'bg-white text-zinc-600 border-zinc-300 hover:border-zinc-400 cursor-pointer'
                        : 'bg-white text-zinc-300 border-zinc-200 cursor-default'
                  )}
                >
                  {idx + 1}. {step.label.toUpperCase()}
                </button>
                {idx < STEPS.length - 1 && (
                  <span className={clsx('text-sm', future ? 'text-zinc-200' : 'text-zinc-400')}>›</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {stepId === 'confirm-cluster' && (
          <ConfirmClusterStep initialAnswer={markedIds.size > 0 ? 'no' : ''} />
        )}
        {stepId === 'remove-accounts' && (
          <RemoveAccountsStep
            holderChecked={holderChecked}
            setHolderChecked={setHolderChecked}
            holderReason={holderReason}
            setHolderReason={setHolderReason}
            holderComment={holderComment}
            setHolderComment={setHolderComment}
            singletonSelected={singletonSelected}
            setSingletonSelected={setSingletonSelected}
            singletonReasons={singletonReasons}
            setSingletonReasons={setSingletonReasons}
            singletonComments={singletonComments}
            setSingletonComments={setSingletonComments}
          />
        )}
        {stepId === 'review-submit' && (
          <ReviewSubmitStep
            holderChecked={holderChecked}
            holderReason={holderReason}
            holderComment={holderComment}
            singletonSelected={singletonSelected}
            singletonReasons={singletonReasons}
            singletonComments={singletonComments}
          />
        )}
      </div>

      {/* Footer */}
      <div className="bg-zinc-50 border-t border-zinc-200">
        <button
          onClick={() => setSummaryOpen(v => !v)}
          className="w-full flex items-center justify-between px-5 py-3 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
        >
          Investigation Summary{isSubmitStep ? ' *' : ''}
          <ChevronUp size={14} className={clsx('text-zinc-400 transition-transform', summaryOpen ? '' : 'rotate-180')} />
        </button>

        {summaryOpen && (
          <div className="px-5 pb-3">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={5}
              placeholder="Describe the evidence reviewed, conflicting signals observed, and your reasoning for the determination..."
              className="w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand placeholder:text-zinc-400"
            />
          </div>
        )}

        <div className="flex items-center gap-3 px-5 pb-4">
          <button
            onClick={activeIdx === STEPS.length - 1 ? () => alert('Cluster verification submitted!') : goNext}
            className="px-5 py-2 bg-brand hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            {activeIdx === STEPS.length - 1 ? 'Submit' : 'Next'}
          </button>
          {activeIdx > 0 && (
            <button onClick={goBack} className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors font-medium">
              Back
            </button>
          )}
          <div className="ml-auto flex items-center gap-1 text-xs text-zinc-400">
            <span className="w-4 h-4 rounded-full border border-zinc-300 flex items-center justify-center text-[9px]">L2</span>
            L2 approval required
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Step 1: Confirm cluster ──────────────────────────────────────────────────

function ConfirmClusterStep({ initialAnswer = '' }: { initialAnswer?: string }) {
  const [answer, setAnswer] = useState<string>(initialAnswer)

  const OPTIONS = [
    { value: 'yes',    label: 'Yes, cluster is accurate',    sub: 'All accounts are operated by one natural person' },
    { value: 'no',     label: 'No, cluster is not accurate', sub: 'One or more accounts should be removed from this cluster' },
    { value: 'unable', label: 'Unable to determine',         sub: 'Insufficient evidence to confirm or deny cluster accuracy' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-zinc-900 mb-1">
          Are the accounts in this cluster operated by one natural person?
        </p>
        <p className="text-xs text-zinc-500 mb-4">
          Review the cluster graph and account evidence before making a determination.
        </p>

        <div className="space-y-2.5">
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setAnswer(opt.value)}
              className={clsx(
                'w-full text-left px-4 py-3 rounded-xl border transition-colors',
                answer === opt.value ? 'border-brand bg-brand/5' : 'border-zinc-200 hover:border-zinc-300 bg-white'
              )}
            >
              <div className="flex items-start gap-3">
                <div className={clsx(
                  'mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center',
                  answer === opt.value ? 'border-brand' : 'border-zinc-300'
                )}>
                  {answer === opt.value && <div className="w-2 h-2 rounded-full bg-brand" />}
                </div>
                <div>
                  <div className={clsx('text-sm font-semibold', answer === opt.value ? 'text-zinc-900' : 'text-zinc-700')}>
                    {opt.label}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">{opt.sub}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {answer === 'yes' && (
        <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2.5 text-xs text-green-800">
          Confirming the cluster will mark NPID_123456 as verified. No accounts will be removed.
        </div>
      )}
      {answer === 'unable' && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2.5 text-xs text-zinc-600">
          This determination will be escalated for further review. Document your reasoning in the investigation summary.
        </div>
      )}
    </div>
  )
}

// ─── Step 2: Remove accounts ──────────────────────────────────────────────────

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={clsx(
        'mt-0.5 w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors',
        checked ? 'border-brand bg-brand' : 'border-zinc-300 bg-white'
      )}
    >
      {checked && <span className="text-white text-[9px] font-bold leading-none">✓</span>}
    </button>
  )
}

function AccountPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-2xs font-medium text-zinc-500 border border-zinc-200 rounded px-1.5 py-0.5 uppercase tracking-wide">
      {children}
    </span>
  )
}

function AccountRow({ name, token, type, verification, status }: {
  name: string; token: string; type: string; verification: string; status: string
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 text-xs border-t border-zinc-100">
      <span className="font-medium text-zinc-900 w-24 shrink-0">{name}</span>
      <span className="font-mono text-zinc-400">{token}</span>
      <div className="flex items-center gap-1.5 ml-auto">
        <AccountPill>{type}</AccountPill>
        <AccountPill>{verification}</AccountPill>
        <span className={clsx(
          'text-2xs font-bold uppercase tracking-wide px-1.5 py-0.5 rounded',
          status === 'SUSPENDED' ? 'text-red-600 bg-red-50' : 'text-green-700 bg-green-100'
        )}>{status}</span>
      </div>
    </div>
  )
}

function RemoveAccountsStep({
  holderChecked, setHolderChecked,
  holderReason, setHolderReason,
  holderComment, setHolderComment,
  singletonSelected, setSingletonSelected,
  singletonReasons, setSingletonReasons,
  singletonComments, setSingletonComments,
}: {
  holderChecked: boolean
  setHolderChecked: (v: boolean | ((p: boolean) => boolean)) => void
  holderReason: string
  setHolderReason: (v: string) => void
  holderComment: string
  setHolderComment: (v: string) => void
  singletonSelected: Set<string>
  setSingletonSelected: (v: Set<string> | ((p: Set<string>) => Set<string>)) => void
  singletonReasons: Record<string, string>
  setSingletonReasons: (v: Record<string, string> | ((p: Record<string, string>) => Record<string, string>)) => void
  singletonComments: Record<string, string>
  setSingletonComments: (v: Record<string, string> | ((p: Record<string, string>) => Record<string, string>)) => void
}) {
  const toggleSingleton = (id: string) =>
    setSingletonSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-zinc-900 mb-0.5">
          Remove accounts or account holders from this NPID cluster
        </p>
        <p className="text-xs text-zinc-500">
          Select each removable unit and choose an unclustering reason.
        </p>
      </div>

      {/* Global holder-unit warning */}
      <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-xs text-amber-800">
        <AlertTriangle size={13} className="shrink-0 mt-0.5 text-amber-500" />
        <span>Account holders with multiple accounts must be removed as a unit. Individual accounts cannot be removed separately from a holder.</span>
      </div>

      {/* Holder-unit card */}
      <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
        <div className="flex items-start gap-3 px-4 py-3">
          <Checkbox checked={holderChecked} onChange={() => setHolderChecked(v => !v)} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-0 flex-wrap">
              <span className="text-sm font-semibold text-zinc-900">
                Remove account holder · {HOLDER_UNIT.label}
              </span>
              <span className="text-2xs font-bold text-amber-600 whitespace-nowrap">
                {HOLDER_UNIT.accounts.length} accounts must be removed together
              </span>
            </div>
            <div className="text-xs text-zinc-400 font-mono mt-0.5">{HOLDER_UNIT.id}</div>
          </div>
        </div>

        {HOLDER_UNIT.accounts.map(a => (
          <AccountRow key={a.token} {...a} />
        ))}

        {holderChecked && (
          <div className="border-t border-zinc-200 px-4 py-3 space-y-3 bg-zinc-50/50">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Unclustering reason <span className="text-red-500">*</span>
              </label>
              <select
                value={holderReason}
                onChange={e => setHolderReason(e.target.value)}
                className={clsx(
                  'w-full h-9 px-3 rounded-lg border text-sm bg-white outline-none appearance-none',
                  holderReason ? 'border-zinc-300 text-zinc-900' : 'border-zinc-200 text-zinc-400',
                  'focus:border-brand focus:ring-2 focus:ring-brand/10'
                )}
              >
                <option value="">Select reason...</option>
                {UNCLUSTERING_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">Comment</label>
              <textarea
                value={holderComment}
                onChange={e => setHolderComment(e.target.value)}
                rows={2}
                placeholder="Optional — supporting notes for L2..."
                className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand placeholder:text-zinc-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* Singleton accounts */}
      {SINGLETONS.map(acct => {
        const checked = singletonSelected.has(acct.id)
        return (
          <div key={acct.id} className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
            <div className="flex items-start gap-3 px-4 py-3">
              <Checkbox checked={checked} onChange={() => toggleSingleton(acct.id)} />
              <div className="flex-1">
                <div className="text-sm font-semibold text-zinc-900">Remove account · {acct.name}</div>
                <div className="text-xs text-zinc-400 font-mono mt-0.5">{acct.token}</div>
              </div>
            </div>

            <AccountRow name={acct.name} token={acct.token} type={acct.type} verification={acct.verification} status={acct.status} />

            {checked && (
              <div className="border-t border-zinc-200 px-4 py-3 space-y-3 bg-zinc-50/50">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Unclustering reason <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={singletonReasons[acct.id] ?? ''}
                    onChange={e => setSingletonReasons(p => ({ ...p, [acct.id]: e.target.value }))}
                    className={clsx(
                      'w-full h-9 px-3 rounded-lg border text-sm bg-white outline-none appearance-none',
                      singletonReasons[acct.id] ? 'border-zinc-300 text-zinc-900' : 'border-zinc-200 text-zinc-400',
                      'focus:border-brand focus:ring-2 focus:ring-brand/10'
                    )}
                  >
                    <option value="">Select reason...</option>
                    {UNCLUSTERING_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Comment</label>
                  <textarea
                    value={singletonComments[acct.id] ?? ''}
                    onChange={e => setSingletonComments(p => ({ ...p, [acct.id]: e.target.value }))}
                    rows={2}
                    placeholder="Optional — supporting notes for L2..."
                    className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand placeholder:text-zinc-400"
                  />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 3: Review & submit ──────────────────────────────────────────────────

const ALL_ACCOUNTS = [
  ...HOLDER_UNIT.accounts.map(a => ({ ...a, id: a.name === 'John Doe' ? 'john-doe' : 'john-doe-llc', inHolder: true })),
  ...SINGLETONS.map(s => ({ ...s, inHolder: false })),
]

function ReviewSubmitStep({
  holderChecked,
  holderReason,
  holderComment,
  singletonSelected,
  singletonReasons,
  singletonComments,
}: {
  holderChecked: boolean
  holderReason: string
  holderComment: string
  singletonSelected: Set<string>
  singletonReasons: Record<string, string>
  singletonComments: Record<string, string>
}) {
  const removedSingletons = SINGLETONS.filter(s => singletonSelected.has(s.id))
  const totalRemoved = (holderChecked ? HOLDER_UNIT.accounts.length : 0) + removedSingletons.length
  const remainingCount = ALL_ACCOUNTS.length - totalRemoved

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold text-zinc-900">Review your determination</p>

      {/* Summary card */}
      <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 space-y-4 text-sm">
        {/* NPID + determination */}
        <div className="space-y-2">
          <ReviewRow label="NPID under review">
            <span className="font-mono text-sm font-medium text-zinc-900">NPID_123456</span>
          </ReviewRow>
          <ReviewRow label="Determination">
            <span className="text-sm font-medium text-zinc-900">Cluster not accurate — accounts to remove</span>
          </ReviewRow>
        </div>

        <div className="border-t border-zinc-200" />

        {/* Proposed removal */}
        <div>
          <div className="text-2xs font-semibold text-zinc-400 uppercase tracking-wide mb-2">Proposed removal</div>

          {holderChecked && (
            <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white mb-2">
              <div className="px-4 py-2.5">
                <div className="text-xs font-semibold text-zinc-900">{HOLDER_UNIT.label}</div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-zinc-400 font-mono">{HOLDER_UNIT.id}</span>
                  <span className="text-xs text-zinc-400">· {HOLDER_UNIT.accounts.length} accounts</span>
                </div>
                <p className="text-2xs text-zinc-400 mt-1">
                  These accounts must be removed together as one account-holder unit.
                </p>
              </div>
              {HOLDER_UNIT.accounts.map(a => (
                <AccountRow key={a.token} {...a} />
              ))}
              {holderReason && (
                <div className="border-t border-zinc-100 px-4 py-2.5 space-y-1">
                  <ReviewRow label="Unclustering reason">
                    <span className="text-xs text-zinc-900">{holderReason}</span>
                  </ReviewRow>
                  {holderComment && (
                    <ReviewRow label="Comment">
                      <span className="text-xs text-zinc-700">{holderComment}</span>
                    </ReviewRow>
                  )}
                </div>
              )}
            </div>
          )}

          {removedSingletons.map(acct => (
            <div key={acct.id} className="border border-zinc-200 rounded-xl overflow-hidden bg-white mb-2">
              <AccountRow name={acct.name} token={acct.token} type={acct.type} verification={acct.verification} status={acct.status} />
              {singletonReasons[acct.id] && (
                <div className="border-t border-zinc-100 px-4 py-2.5 space-y-1">
                  <ReviewRow label="Unclustering reason">
                    <span className="text-xs text-zinc-900">{singletonReasons[acct.id]}</span>
                  </ReviewRow>
                  {singletonComments[acct.id] && (
                    <ReviewRow label="Comment">
                      <span className="text-xs text-zinc-700">{singletonComments[acct.id]}</span>
                    </ReviewRow>
                  )}
                </div>
              )}
            </div>
          ))}

          {!holderChecked && removedSingletons.length === 0 && (
            <p className="text-xs text-zinc-400 italic">No accounts selected for removal.</p>
          )}
        </div>

        {/* Resulting cluster */}
        {remainingCount > 0 && (
          <>
            <div className="border-t border-zinc-200" />
            <div>
              <div className="text-2xs font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">Resulting cluster</div>
              <p className="text-xs text-zinc-700">
                <span className="font-medium">{remainingCount} account{remainingCount !== 1 ? 's' : ''}</span> will remain in NPID_123456
              </p>
              <p className="text-2xs text-zinc-400 mt-0.5">No changes take effect until L2 approval</p>
            </div>
          </>
        )}
      </div>

      {/* L2 notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-amber-800 mb-0.5">
          <span className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-white text-[9px] shrink-0">!</span>
          L2 approval required
        </div>
        <p className="text-amber-700 ml-5.5">
          This proposed removal will be routed to a senior analyst for approval. No changes will be applied to NPID_123456 until approved.
        </p>
      </div>
    </div>
  )
}

function ReviewRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2 text-xs">
      <span className="text-zinc-400 shrink-0 w-36">{label}</span>
      <div className="text-zinc-700 min-w-0">{children}</div>
    </div>
  )
}

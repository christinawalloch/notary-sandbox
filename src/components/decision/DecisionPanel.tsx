import { useState, useEffect } from 'react'
import { X, Clock, ChevronUp, Pencil } from 'lucide-react'
import clsx from 'clsx'
import { Toggle } from '../ui/Toggle'

const STEPS = [
  { id: 'disposition', label: 'Disposition' },
  { id: 'escalation', label: 'Escalation' },
  { id: 'adverse-actions', label: 'Adverse Actions' },
]

// ─── Pattern taxonomy ─────────────────────────────────────────────────────────

const PATTERN_CATEGORIES = [
  'Structuring',
  'Rapid Movement of Funds',
  'Funnel Account',
  'Layering',
  'Smurfing',
  'Other',
]

const SPECIFIC_PATTERNS: Record<string, string[]> = {
  'Structuring':             ['Structuring', 'Multiple Structuring Attempts', 'Cash Structuring'],
  'Rapid Movement of Funds': ['Rapid In-Out Transfers', 'Pass-Through Activity', 'Round-Tripping'],
  'Funnel Account':          ['Funnel Account — Inflows', 'Funnel Account — Outflows'],
  'Layering':                ['Complex Layering', 'Shell Account Activity'],
  'Smurfing':                ['Smurfing — Deposits', 'Smurfing — Payments'],
}

const PRODUCT_OPTIONS = ['P2P', 'BNPL', 'Cash BTC Lightning', 'Bill Pay', 'Borrow', 'Investing']

// ─── Denylist reason taxonomy ─────────────────────────────────────────────────

const DENYLIST_REASONS_DEFAULT = [
  'AML / Transaction Monitoring',
  'Fraud',
  'Scams',
  'Account Takeover',
  'Sanctions',
  'Other',
]

const DENYLIST_REASONS_BY_VARIANT: Partial<Record<string, string[]>> = {
  'scams-l1': ['Scams', 'AML / Transaction Monitoring', 'Fraud', 'Account Takeover', 'Sanctions', 'Other'],
  'scams-l2': ['Scams', 'AML / Transaction Monitoring', 'Fraud', 'Account Takeover', 'Sanctions', 'Other'],
  'npid-bau': ['Account Takeover', 'AML / Transaction Monitoring', 'Fraud', 'Scams', 'Sanctions', 'Other'],
}

// ─── Types ────────────────────────────────────────────────────────────────────

type PatternEntry = { id: string; category: string; specific: string; otherText: string }

let _pid = 0
const mkPattern = (): PatternEntry => ({ id: String(++_pid), category: '', specific: '', otherText: '' })

// ─── DecisionPanel shell ──────────────────────────────────────────────────────

interface DecisionPanelProps {
  assignmentId: string
  accountToken: string
  onClose: () => void
  onComplete?: () => void
  decisionVariant?: string
}

export function DecisionPanel({ assignmentId: _assignmentId, accountToken, onClose, onComplete, decisionVariant }: DecisionPanelProps) {
  const denylistReasons = DENYLIST_REASONS_BY_VARIANT[decisionVariant ?? ''] ?? DENYLIST_REASONS_DEFAULT

  const [stepId, setStepId] = useState('disposition')
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [showReview, setShowReview] = useState(false)

  // Disposition state
  const [unusual, setUnusual] = useState<boolean | null>(null)
  const [patterns, setPatterns] = useState<PatternEntry[]>(() => [mkPattern()])
  const [products, setProducts] = useState<string[]>([])

  // Escalation state
  const [escalation, setEscalation] = useState('No')

  // Adverse actions state
  const [apply, setApply] = useState<boolean | null>(null)
  const [action, setAction] = useState('')
  const [denylistReason, setDenylistReason] = useState('')
  const [denylistOtherText, setDenylistOtherText] = useState('')

  const activeIdx = STEPS.findIndex(s => s.id === stepId)
  const isLast = activeIdx === STEPS.length - 1

  useEffect(() => {
    if (isLast) setSummaryOpen(true)
  }, [isLast])

  const goNext = () => {
    if (activeIdx < STEPS.length - 1) setStepId(STEPS[activeIdx + 1].id)
  }
  const goBack = () => {
    if (activeIdx > 0) setStepId(STEPS[activeIdx - 1].id)
  }

  const canSubmit = isLast && comment.trim().length > 0

  const updatePattern = (id: string, patch: Partial<PatternEntry>) =>
    setPatterns(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p))
  const addPattern = () => setPatterns(prev => [...prev, mkPattern()])
  const removePattern = (id: string) => setPatterns(prev => prev.filter(p => p.id !== id))

  return (
    <>
      <div className="w-[500px] shrink-0 border-l border-zinc-200 bg-white flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-zinc-900">Decide</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Stepper */}
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
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
        <div className="flex-1 overflow-y-auto px-5 py-2">
          {stepId === 'disposition' && (
            <DispositionStep
              accountToken={accountToken}
              unusual={unusual}
              onUnusual={setUnusual}
              patterns={patterns}
              onUpdatePattern={updatePattern}
              onAddPattern={addPattern}
              onRemovePattern={removePattern}
              products={products}
              onProducts={setProducts}
            />
          )}
          {stepId === 'escalation' && (
            <EscalationStep escalation={escalation} onEscalation={setEscalation} />
          )}
          {stepId === 'adverse-actions' && (
            <AdverseActionsStep
              accountToken={accountToken}
              denylistReasons={denylistReasons}
              apply={apply}
              onApply={v => { setApply(v); setAction(''); setDenylistReason(''); setDenylistOtherText('') }}
              action={action}
              onAction={v => { setAction(v); setDenylistReason(''); setDenylistOtherText('') }}
              denylistReason={denylistReason}
              onDenylistReason={v => { setDenylistReason(v); setDenylistOtherText('') }}
              denylistOtherText={denylistOtherText}
              onDenylistOtherText={setDenylistOtherText}
            />
          )}
        </div>

        {/* Footer */}
        <div className="bg-zinc-50 border-t border-zinc-200">
          <button
            onClick={() => setSummaryOpen(v => !v)}
            className="w-full flex items-center justify-between px-5 py-3 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            Investigation Summary*
            <ChevronUp size={14} className={clsx('text-zinc-400 transition-transform', !summaryOpen && 'rotate-180')} />
          </button>
          {summaryOpen && (
            <div className="px-5 pb-3">
              <label className="block text-sm text-zinc-500 mb-1.5">
                Comment <span className="text-red-500">*</span>
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Add investigation notes..."
                className="w-full h-[calc(33vh-6.5rem)] min-h-32 px-3 py-2 text-sm border border-zinc-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand/20 placeholder:text-zinc-400"
              />
            </div>
          )}
          <div className="flex items-center gap-3 px-5 pb-4">
            <button
              onClick={isLast ? (canSubmit ? () => setShowReview(true) : undefined) : goNext}
              disabled={isLast ? !canSubmit : false}
              className={clsx(
                'px-5 py-2 text-sm font-semibold rounded-lg transition-colors shadow-sm',
                (isLast && !canSubmit)
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
                  : 'bg-brand hover:bg-brand-600 text-white'
              )}
            >
              {isLast ? 'Submit' : 'Next'}
            </button>
            {activeIdx > 0 && (
              <button onClick={goBack} className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors font-medium">
                Back
              </button>
            )}
            <div className="ml-auto flex items-center gap-1 text-xs text-zinc-400">
              <Clock size={12} />
              1 hour
            </div>
          </div>
        </div>
      </div>

      {showReview && (
        <ReviewModal
          unusual={unusual}
          patterns={patterns}
          products={products}
          escalation={escalation}
          apply={apply}
          action={action}
          denylistReason={denylistReason}
          denylistOtherText={denylistOtherText}
          accountToken={accountToken}
          comment={comment}
          onCancel={() => setShowReview(false)}
          onEdit={stepId => { setShowReview(false); setStepId(stepId) }}
          onSubmit={() => { onClose(); onComplete?.() }}
        />
      )}
    </>
  )
}

// ─── Step 1: Disposition ──────────────────────────────────────────────────────

function DispositionStep({
  accountToken,
  unusual, onUnusual,
  patterns, onUpdatePattern, onAddPattern, onRemovePattern,
  products, onProducts,
}: {
  accountToken: string
  unusual: boolean | null
  onUnusual: (v: boolean) => void
  patterns: PatternEntry[]
  onUpdatePattern: (id: string, patch: Partial<PatternEntry>) => void
  onAddPattern: () => void
  onRemovePattern: (id: string) => void
  products: string[]
  onProducts: (v: string[]) => void
}) {
  const removeProduct = (p: string) => onProducts(products.filter(x => x !== p))
  const addProduct = (p: string) => { if (!products.includes(p)) onProducts([...products, p]) }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-zinc-600 mb-2">Is there unusual activity?</p>
        <Toggle value={unusual} onChange={onUnusual} />
      </div>

      {unusual && (
        <div>
          {patterns.map((pat, idx) => (
            <div key={pat.id} className={clsx(idx > 0 && 'mt-4 pt-4 border-t border-zinc-100')}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-zinc-900">
                  {idx === 0 ? 'Primary Unusual Pattern:' : `Unusual Pattern ${idx + 1}:`}
                </h3>
                {idx > 0 && (
                  <button
                    onClick={() => onRemovePattern(pat.id)}
                    className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>

              <Field label="Pattern category">
                <Select
                  value={pat.category}
                  onChange={v => onUpdatePattern(pat.id, { category: v, specific: '', otherText: '' })}
                  placeholder="Select..."
                  options={PATTERN_CATEGORIES}
                  filled={!!pat.category}
                />
              </Field>

              {pat.category && pat.category !== 'Other' && (
                <Field label="Specific pattern">
                  <Select
                    value={pat.specific}
                    onChange={v => onUpdatePattern(pat.id, { specific: v })}
                    placeholder="Select..."
                    options={SPECIFIC_PATTERNS[pat.category] ?? []}
                    filled={!!pat.specific}
                  />
                </Field>
              )}

              {pat.category === 'Other' && (
                <Field label="Describe the unusual pattern">
                  <textarea
                    value={pat.otherText}
                    onChange={e => onUpdatePattern(pat.id, { otherText: e.target.value })}
                    placeholder="Describe the pattern..."
                    className="w-full h-20 px-3 py-2 text-sm border border-zinc-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand/20 placeholder:text-zinc-400"
                  />
                </Field>
              )}
            </div>
          ))}

          <Field label="Products involved">
            <div className={clsx(
              'flex flex-wrap items-center gap-1.5 px-3 py-2 rounded-xl border min-h-[38px]',
              products.length > 0 ? 'border-brand' : 'border-zinc-200'
            )}>
              {products.map(p => (
                <span key={p} className="flex items-center gap-1 bg-zinc-100 text-zinc-700 text-xs px-2 py-0.5 rounded-full">
                  {p}
                  <button onClick={() => removeProduct(p)} className="text-zinc-400 hover:text-zinc-700 text-base leading-none">×</button>
                </span>
              ))}
              <select
                className="flex-1 min-w-[80px] bg-transparent text-sm text-zinc-400 outline-none"
                value=""
                onChange={e => { addProduct(e.target.value); e.target.value = '' }}
              >
                <option value="" disabled>Select products</option>
                {PRODUCT_OPTIONS.filter(o => !products.includes(o)).map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </Field>

          <Field label="Accounts involved">
            <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 text-xs rounded-full font-mono">
              {accountToken}
            </span>
          </Field>

          <button
            onClick={onAddPattern}
            className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-4 py-2 rounded-lg transition-colors mt-1"
          >
            + add unusual pattern
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Step 2: Escalation ───────────────────────────────────────────────────────

function EscalationStep({ escalation, onEscalation }: { escalation: string; onEscalation: (v: string) => void }) {
  const ESCALATION_OPTIONS = [
    'No',
    'Yes - Escalate to SAR Team',
    'Yes - Refer to Compliance',
    'Yes - Refer to Financial Crimes',
  ]

  return (
    <div className="space-y-4">
      <Field label="Escalate or refer this account?">
        <Select
          value={escalation}
          onChange={onEscalation}
          options={ESCALATION_OPTIONS}
          filled={escalation !== 'No'}
        />
      </Field>

      {escalation !== 'No' && (
        <div>
          <p className="text-sm font-medium text-zinc-700 mb-1">
            Add additional associated accounts (optional)
          </p>
          <p className="text-xs text-zinc-500 mb-2">
            A comma-separated list of Cash Customer or Square Register Unit tokens.
          </p>
          <div className="flex gap-2">
            <textarea
              className="flex-1 px-3 py-2 text-sm border border-zinc-200 rounded-xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-brand/20 placeholder:text-zinc-400"
              placeholder=""
            />
            <button className="self-end text-sm text-zinc-400 hover:text-zinc-700 px-2 whitespace-nowrap">
              + Add
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Step 3: Adverse Actions ─────────────────────────────────────────────────

function AdverseActionsStep({
  accountToken, denylistReasons,
  apply, onApply,
  action, onAction,
  denylistReason, onDenylistReason,
  denylistOtherText, onDenylistOtherText,
}: {
  accountToken: string
  denylistReasons: string[]
  apply: boolean | null
  onApply: (v: boolean) => void
  action: string
  onAction: (v: string) => void
  denylistReason: string
  onDenylistReason: (v: string) => void
  denylistOtherText: string
  onDenylistOtherText: (v: string) => void
}) {
  const ACTIONS = ['Denylist', 'Apply Strike', 'Revoke Denylist']
  const CATEGORIES = ['Financial Services', 'Marketplace', 'Cash App Pay', 'Borrow']
  const PRODUCTS = ['P2P', 'BNPL', 'Bill Pay', 'Investing']
  const ADVERSITIES = ['AML / Transaction Monitoring - Applied Aug 2025', 'Prior Strike - Jan 2025']
  const REVOCATION_REASONS = ['Insufficient Evidence', 'Successful Appeal', 'Error in Application']

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-zinc-600 mb-2">Do you want to apply adverse actions?</p>
        <Toggle value={apply} onChange={onApply} />
      </div>

      {apply && (
        <>
          <div>
            <p className="text-sm text-zinc-500 mb-2">Alerted Account</p>
            <div className="border border-zinc-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs text-zinc-800 break-all">{accountToken}</span>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="inline-flex text-2xs font-semibold px-1.5 py-0.5 rounded border bg-green-50 text-green-700 border-green-200 uppercase tracking-wide whitespace-nowrap">
                    ACTIVE
                  </span>
                  {action === 'Apply Strike' && (
                    <span className="text-2xs text-zinc-500 border border-zinc-200 px-2 py-0.5 rounded-full">
                      0 of 3 strikes
                    </span>
                  )}
                </div>
              </div>

              <Field label="Select action">
                <Select
                  value={action}
                  onChange={onAction}
                  placeholder="Select..."
                  options={ACTIONS}
                  filled={!!action}
                />
              </Field>

              {action === 'Denylist' && (
                <>
                  <Field label="Denylist reason">
                    <Select
                      value={denylistReason}
                      onChange={onDenylistReason}
                      placeholder="Select reason..."
                      options={denylistReasons}
                      filled={!!denylistReason}
                    />
                  </Field>
                  {denylistReason === 'Other' && (
                    <Field label="Describe the reason">
                      <textarea
                        value={denylistOtherText}
                        onChange={e => onDenylistOtherText(e.target.value)}
                        placeholder="Explain the denylist reason..."
                        className="w-full h-20 px-3 py-2 text-sm border border-zinc-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand/20 placeholder:text-zinc-400"
                      />
                    </Field>
                  )}
                  <p className="text-xs text-zinc-400 -mt-1">
                    The unusual pattern from Disposition will also be included in the investigation summary.
                  </p>
                </>
              )}

              {action === 'Apply Strike' && (
                <>
                  <Field label="Select category">
                    <Select value="" onChange={() => {}} placeholder="Select category" options={CATEGORIES} />
                  </Field>
                  <Field label="Select products abused">
                    <Select value="" onChange={() => {}} placeholder="Select products abused" options={PRODUCTS} />
                  </Field>
                </>
              )}

              {action === 'Revoke Denylist' && (
                <>
                  <Field label="Select adversity">
                    <Select value="" onChange={() => {}} placeholder="Select adversity to revoke" options={ADVERSITIES} />
                  </Field>
                  <Field label="Revocation reason">
                    <Select value="" onChange={() => {}} placeholder="Select revocation reason" options={REVOCATION_REASONS} />
                  </Field>
                </>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-zinc-700 mb-0.5">Add additional accounts</p>
            <p className="text-xs text-zinc-500 mb-2">Add other customer tokens to apply the same adversity</p>
            <div className="flex gap-2">
              <textarea
                className="flex-1 px-3 py-2 text-sm border border-zinc-200 rounded-xl resize-none h-20 focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              <button className="self-end text-sm text-zinc-400 hover:text-zinc-700 px-2 whitespace-nowrap">
                + Add
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Review Modal ─────────────────────────────────────────────────────────────

function ReviewModal({
  unusual, patterns, products,
  escalation,
  apply, action, denylistReason, denylistOtherText, accountToken,
  comment,
  onCancel, onEdit, onSubmit,
}: {
  unusual: boolean | null
  patterns: PatternEntry[]
  products: string[]
  escalation: string
  apply: boolean | null
  action: string
  denylistReason: string
  denylistOtherText: string
  accountToken: string
  comment: string
  onCancel: () => void
  onEdit: (stepId: string) => void
  onSubmit: () => void
}) {
  const filledPatterns = patterns.filter(p => p.category)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div
        className="relative bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 shrink-0">
          <h2 className="text-lg font-bold text-zinc-900">Review & Submit</h2>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-10">
          <ReviewSection title="Disposition" onEdit={() => onEdit('disposition')}>
            <div className="grid grid-cols-3 gap-x-10 gap-y-4">
              <ReviewField label="Unusual activity" value={unusual ? 'Yes' : 'No'} />
              {unusual && filledPatterns.length > 0 && (
                <div className="col-span-3 mt-2 space-y-3">
                  {filledPatterns.map((pat, idx) => (
                    <div key={pat.id} className="grid grid-cols-3 gap-x-10 gap-y-2">
                      <ReviewField
                        label={idx === 0 ? 'Pattern category' : `Pattern ${idx + 1} category`}
                        value={pat.category}
                      />
                      {pat.category !== 'Other' && pat.specific && (
                        <ReviewField label="Specific pattern" value={pat.specific} />
                      )}
                      {pat.category === 'Other' && pat.otherText && (
                        <div className="col-span-2">
                          <ReviewField label="Pattern description" value={pat.otherText} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {unusual && products.length > 0 && (
                <ReviewField label="Products involved" value={products.join(', ')} />
              )}
              {unusual && (
                <ReviewField label="Account" value={accountToken} />
              )}
            </div>
          </ReviewSection>

          <ReviewSection title="Escalation" onEdit={() => onEdit('escalation')}>
            <div className="grid grid-cols-3 gap-x-10 gap-y-4">
              <ReviewField label="Escalation" value={escalation} />
            </div>
          </ReviewSection>

          <ReviewSection title="Adverse Actions" onEdit={() => onEdit('adverse-actions')}>
            <div className="grid grid-cols-3 gap-x-10 gap-y-4">
              {apply ? (
                <>
                  <ReviewField label="Action" value={action || '—'} />
                  {action === 'Denylist' && (
                    <ReviewField
                      label="Denylist reason"
                      value={denylistReason === 'Other' ? denylistOtherText || '—' : denylistReason || '—'}
                    />
                  )}
                  <ReviewField label="Account" value={accountToken} />
                </>
              ) : (
                <ReviewField label="Adverse action" value="No" />
              )}
              {comment && (
                <div className="col-span-3 mt-2">
                  <ReviewField label="Investigation Summary" value={comment} />
                </div>
              )}
            </div>
          </ReviewSection>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 shrink-0">
          <button
            onClick={onCancel}
            className="text-sm text-zinc-500 hover:text-zinc-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-2 bg-brand hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Shared primitives ────────────────────────────────────────────────────────

function ReviewSection({ title, onEdit, children }: { title: string; onEdit?: () => void; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{title}</h3>
        {onEdit && (
          <button
            onClick={onEdit}
            className="w-5 h-5 flex items-center justify-center rounded text-zinc-300 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            <Pencil size={11} />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

function ReviewField({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <p className="text-xs text-zinc-400 mb-1">{label}</p>
      <p className="text-sm font-medium text-zinc-900">{value}</p>
      {sub && <p className="text-xs font-mono text-zinc-500 mt-0.5">{sub}</p>}
    </div>
  )
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="mb-3">
      <label className="block text-sm text-zinc-500 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function Select({
  value, onChange, placeholder, options, filled,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  options: string[]
  filled?: boolean
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={clsx(
        'w-full h-10 px-3 rounded-xl border text-sm bg-white outline-none transition-colors appearance-none',
        filled || value ? 'border-brand text-zinc-900' : 'border-zinc-200 text-zinc-400',
        'focus:border-brand focus:ring-2 focus:ring-brand/10'
      )}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

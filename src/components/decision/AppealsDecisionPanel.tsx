import { useState, useEffect } from 'react'
import { X, Clock, ChevronUp, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { Toggle } from '../ui/Toggle'

const STEPS = [
  { id: 'appeal-decision', label: 'Disposition' },
  { id: 'escalation', label: 'Escalation' },
  { id: 'adverse-actions', label: 'Adverse Actions' },
]

interface AppealsDecisionPanelProps {
  assignmentId: string
  onClose: () => void
  onComplete: (isL2: boolean) => void
  previewStep?: string | null
}

export function AppealsDecisionPanel({ onClose, onComplete, previewStep }: AppealsDecisionPanelProps) {
  const n = Number(previewStep)

  const [stepId, setStepId] = useState(
    n >= 3 ? 'adverse-actions' : n === 2 ? 'escalation' : 'appeal-decision'
  )
  const [appealIsOverturn, setAppealIsOverturn] = useState<boolean | null>(n >= 1 ? true : null)
  const [escalate, setEscalate] = useState<boolean | null>(null)
  const [applyChanges, setApplyChanges] = useState<boolean | null>(n >= 3 ? true : null)
  const [meiAction, setMeiAction] = useState(n >= 3 ? 'Revoke denylist' : '')
  const [meiRevokeReason, setMeiRevokeReason] = useState(n >= 3 ? 'Successful appeal — identity verified' : '')
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [showReview, setShowReview] = useState(false)

  const activeIdx = STEPS.findIndex(s => s.id === stepId)
  const isLast = activeIdx === STEPS.length - 1

  useEffect(() => {
    if (isLast) setSummaryOpen(true)
  }, [isLast])

  const isNextDisabled =
    (stepId === 'appeal-decision' && appealIsOverturn === null) ||
    (stepId === 'escalation' && escalate === null) ||
    (stepId === 'adverse-actions' && (
      applyChanges === null ||
      (applyChanges && (!meiAction || (meiAction === 'Revoke denylist' && !meiRevokeReason)))
    ))

  const goNext = () => {
    if (activeIdx < STEPS.length - 1) setStepId(STEPS[activeIdx + 1].id)
  }
  const goBack = () => {
    if (activeIdx > 0) setStepId(STEPS[activeIdx - 1].id)
  }

  const ctaLabel = isLast
    ? (appealIsOverturn ? 'Submit for L2 Review' : 'Submit Decision')
    : 'Next'

  const canSubmit = isLast && !!comment.trim()

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
          {stepId === 'appeal-decision' && (
            <AppealDecisionStep value={appealIsOverturn} onChange={setAppealIsOverturn} />
          )}
          {stepId === 'escalation' && (
            <EscalationStep value={escalate} onChange={setEscalate} />
          )}
          {stepId === 'adverse-actions' && (
            <AdverseActionsStep
              apply={applyChanges}
              onApply={v => { setApplyChanges(v); setMeiAction(''); setMeiRevokeReason('') }}
              meiAction={meiAction} onMeiAction={v => { setMeiAction(v); setMeiRevokeReason('') }}
              meiRevokeReason={meiRevokeReason} onMeiRevokeReason={setMeiRevokeReason}
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
                className="w-full h-28 px-3 py-2 text-sm border border-zinc-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-brand/20 placeholder:text-zinc-400"
              />
            </div>
          )}
          <div className="flex items-center gap-3 px-5 pb-4">
            <button
              onClick={isLast ? (canSubmit ? () => setShowReview(true) : undefined) : (isNextDisabled ? undefined : goNext)}
              disabled={isLast ? !canSubmit : isNextDisabled}
              className={clsx(
                'px-5 py-2 text-sm font-semibold rounded-lg transition-colors shadow-sm',
                (isLast ? !canSubmit : isNextDisabled)
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
                  : 'bg-brand hover:bg-brand-600 text-white'
              )}
            >
              {ctaLabel}
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
          appealIsOverturn={appealIsOverturn}
          escalate={escalate}
          applyChanges={applyChanges}
          meiAction={meiAction}
          meiRevokeReason={meiRevokeReason}
          comment={comment}
          onCancel={() => setShowReview(false)}
          onSubmit={() => { onClose(); onComplete(appealIsOverturn ?? false) }}
        />
      )}
    </>
  )
}

// ─── Review Modal ─────────────────────────────────────────────────────────────

function ReviewModal({
  appealIsOverturn, escalate, applyChanges, meiAction, meiRevokeReason, comment, onCancel, onSubmit,
}: {
  appealIsOverturn: boolean | null
  escalate: boolean | null
  applyChanges: boolean | null
  meiAction: string
  meiRevokeReason: string
  comment: string
  onCancel: () => void
  onSubmit: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
      <div
        className="relative bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-5 shrink-0">
          <h2 className="text-lg font-bold text-zinc-900">Review & Submit</h2>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-10">

          {/* Section 1 — Disposition */}
          <ReviewSection title="Disposition">
            <div className="grid grid-cols-3 gap-x-10 gap-y-4">
              <ReviewField label="Appeal Outcome" value={appealIsOverturn ? 'Overturn' : 'Uphold'} />
            </div>
          </ReviewSection>

          {/* Section 2 — Escalation */}
          <ReviewSection title="Escalation">
            <div className="grid grid-cols-3 gap-x-10 gap-y-4">
              <ReviewField label="Escalate" value={escalate ? 'Yes' : 'No'} />
            </div>
          </ReviewSection>

          {/* Section 3 — Adverse Actions */}
          <ReviewSection title="Adverse Actions">
            <div className="grid grid-cols-3 gap-x-10 gap-y-4">
              <ReviewField label="Revoke Adversity" value={applyChanges ? 'Yes' : 'No'} />
              {applyChanges && (
                <>
                  <ReviewField label="Account" value="Mei Chen" sub="C_r4xw8mhkq" />
                  <ReviewField label="Action" value={meiAction || '—'} />
                  {meiAction === 'Revoke denylist' && meiRevokeReason && (
                    <ReviewField label="Revocation Reason" value={meiRevokeReason} />
                  )}
                </>
              )}
              {comment && (
                <div className="col-span-3 mt-2">
                  <ReviewField label="Investigation Summary" value={comment} />
                </div>
              )}
            </div>
          </ReviewSection>

        </div>

        {/* Footer */}
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
            {appealIsOverturn ? 'Submit for L2 Review' : 'Submit Decision'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-zinc-900 mb-3">{title}</h3>
      {children}
    </div>
  )
}

function ReviewField({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="text-xs">
      <span className="font-medium text-zinc-900">{label}</span>{' '}
      <span className="text-zinc-500">{value}</span>
      {sub && <span className="font-mono text-zinc-400 ml-1">{sub}</span>}
    </div>
  )
}

// ─── Step 1: Appeal Decision ──────────────────────────────────────────────────

function AppealDecisionStep({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-zinc-600 mb-2">What is the outcome of this appeal?</p>
        <Toggle value={value} onChange={onChange} labels={['Uphold', 'Overturn']} />
      </div>
    </div>
  )
}

// ─── Step 2: Escalation ───────────────────────────────────────────────────────

function EscalationStep({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-zinc-600 mb-2">Escalate or refer this account?</p>
        <Toggle value={value} onChange={onChange} />
      </div>

      {value && (
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

// ─── Step 3: Adverse Actions ──────────────────────────────────────────────────

const REVOKE_REASONS = [
  'Successful appeal — identity verified',
  'Incorrect association / mistaken identity',
  'Insufficient evidence of wrongdoing',
  'Account activity consistent with legitimate use',
  'Account Takeover',
]

function AdverseActionsStep({
  apply, onApply,
  meiAction, onMeiAction,
  meiRevokeReason, onMeiRevokeReason,
}: {
  apply: boolean | null; onApply: (v: boolean) => void
  meiAction: string; onMeiAction: (v: string) => void
  meiRevokeReason: string; onMeiRevokeReason: (v: string) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-zinc-600 mb-2">Do you want to revoke an existing adversity?</p>
        <Toggle value={apply} onChange={onApply} />
      </div>

      {apply === true && (
        <div>
          <p className="text-sm text-zinc-500 mb-2">Alerted Account</p>
          <div className="border border-zinc-200 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-medium text-zinc-800">Mei Chen</div>
                <span className="font-mono text-xs text-zinc-500">C_r4xw8mhkq</span>
              </div>
              <span className="text-2xs font-bold text-red-600 uppercase tracking-widest shrink-0">DENYLISTED</span>
            </div>
            <div className="text-xs text-zinc-500 space-y-0.5">
              <div><span className="text-zinc-400">Current state:</span> Denylisted</div>
              <div><span className="text-zinc-400">Active adversity:</span> Account-level scam denylist</div>
            </div>
            <Field label="Select action">
              <Select
                value={meiAction}
                onChange={onMeiAction}
                placeholder="Select..."
                options={['No change', 'Revoke denylist']}
                filled={meiAction === 'Revoke denylist'}
              />
            </Field>
            {meiAction === 'Revoke denylist' && (
              <Field label="Revocation reason">
                <Select
                  value={meiRevokeReason}
                  onChange={onMeiRevokeReason}
                  placeholder="Select reason..."
                  options={REVOKE_REASONS}
                  filled={!!meiRevokeReason}
                />
              </Field>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Shared primitives ────────────────────────────────────────────────────────

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
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={clsx(
          'w-full h-10 pl-3 pr-8 rounded-xl border text-sm bg-white outline-none transition-colors appearance-none',
          filled || value ? 'border-brand text-zinc-900' : 'border-zinc-200 text-zinc-400',
          'focus:border-brand focus:ring-2 focus:ring-brand/10'
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
    </div>
  )
}

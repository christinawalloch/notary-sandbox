import { useState, useEffect } from 'react'
import { X, Clock, ChevronUp } from 'lucide-react'
import clsx from 'clsx'
import { Toggle } from '../ui/Toggle'

const STEPS = [
  { id: 'disposition', label: 'Disposition' },
  { id: 'escalation', label: 'Escalation' },
  { id: 'adverse-actions', label: 'Adverse Actions' },
]

const ESCALATION_TARGETS = [
  'SAR Team',
  'Compliance',
  'Financial Crimes',
]

const ACTIONS = ['Apply adverse action', 'Revoke adversity']
const REASONS = ['Scams', 'Fraud', 'AML Violation', 'Account Takeover']

interface ScamsDecisionPanelProps {
  onClose: () => void
  onComplete: () => void
}

export function ScamsDecisionPanel({ onClose, onComplete }: ScamsDecisionPanelProps) {
  const [stepId, setStepId] = useState('disposition')
  const [suspiciousActivity, setSuspiciousActivity] = useState<boolean | null>(null)
  const [escalation, setEscalation] = useState<boolean | null>(null)
  const [escalationTarget, setEscalationTarget] = useState('')
  const [applyAdverse, setApplyAdverse] = useState<boolean | null>(null)
  const [action, setAction] = useState('')
  const [reason, setReason] = useState('')
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [showReview, setShowReview] = useState(false)

  const activeIdx = STEPS.findIndex(s => s.id === stepId)
  const isLast = activeIdx === STEPS.length - 1

  useEffect(() => {
    if (isLast) setSummaryOpen(true)
  }, [isLast])

  const isNextDisabled =
    (stepId === 'disposition' && suspiciousActivity === null) ||
    (stepId === 'escalation' && escalation === null) ||
    (stepId === 'adverse-actions' && (applyAdverse === null || (applyAdverse === true && (!action || !reason))))

  const canSubmit = isLast && comment.trim().length > 0

  const goNext = () => { if (activeIdx < STEPS.length - 1) setStepId(STEPS[activeIdx + 1].id) }
  const goBack = () => { if (activeIdx > 0) setStepId(STEPS[activeIdx - 1].id) }

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
            <DispositionStep value={suspiciousActivity} onChange={setSuspiciousActivity} />
          )}
          {stepId === 'escalation' && (
            <EscalationStep
              value={escalation}
              onChange={v => { setEscalation(v); if (!v) setEscalationTarget('') }}
              target={escalationTarget}
              onTarget={setEscalationTarget}
            />
          )}
          {stepId === 'adverse-actions' && (
            <AdverseActionsStep
              apply={applyAdverse}
              onApply={v => { setApplyAdverse(v); setAction(''); setReason('') }}
              action={action}
              onAction={v => { setAction(v); setReason('') }}
              reason={reason}
              onReason={setReason}
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
              onClick={isLast ? (canSubmit ? () => setShowReview(true) : undefined) : (isNextDisabled ? undefined : goNext)}
              disabled={isLast ? !canSubmit : isNextDisabled}
              className={clsx(
                'px-5 py-2 text-sm font-semibold rounded-lg transition-colors shadow-sm',
                (isLast ? !canSubmit : isNextDisabled)
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
          suspiciousActivity={suspiciousActivity}
          escalation={escalation}
          applyAdverse={applyAdverse}
          action={action}
          reason={reason}
          comment={comment}
          onCancel={() => setShowReview(false)}
          onSubmit={() => { onClose(); onComplete() }}
        />
      )}
    </>
  )
}

// ─── Step 1: Disposition ──────────────────────────────────────────────────────

function DispositionStep({ value, onChange }: { value: boolean | null; onChange: (v: boolean) => void }) {
  return (
    <div>
      <p className="text-sm text-zinc-600 mb-3">Is there suspicious activity?</p>
      <Toggle value={value} onChange={onChange} />
    </div>
  )
}

// ─── Step 2: Escalation ───────────────────────────────────────────────────────

function EscalationStep({ value, onChange, target, onTarget }: {
  value: boolean | null
  onChange: (v: boolean) => void
  target: string
  onTarget: (v: string) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-zinc-600 mb-3">Do you need to escalate or refer this assignment?</p>
        <Toggle value={value} onChange={onChange} />
      </div>

      {value === true && (
        <>
          <Field label="Escalate or refer to:">
            <Select
              value={target}
              onChange={onTarget}
              placeholder="Select..."
              options={ESCALATION_TARGETS}
              filled={!!target}
            />
          </Field>
          <div>
            <p className="text-sm font-medium text-zinc-700 mb-0.5">Add additional associated accounts</p>
            <p className="text-xs text-zinc-500 mb-2">
              A comma-separated list of customer tokens.
            </p>
            <div className="flex gap-2">
              <textarea
                className="flex-1 px-3 py-2 text-sm border border-zinc-200 rounded-xl resize-none h-20 focus:outline-none focus:ring-2 focus:ring-brand/20 placeholder:text-zinc-400"
                placeholder=""
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

// ─── Step 3: Adverse Actions ─────────────────────────────────────────────────

function AdverseActionsStep({ apply, onApply, action, onAction, reason, onReason }: {
  apply: boolean | null
  onApply: (v: boolean) => void
  action: string
  onAction: (v: string) => void
  reason: string
  onReason: (v: string) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-zinc-600 mb-3">Do you want to apply or revoke adverse actions?</p>
        <Toggle value={apply} onChange={onApply} />
      </div>

      {apply === true && (
        <div>
          <p className="text-sm text-zinc-500 mb-2">Alerted Account</p>
          <div className="border border-zinc-200 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-zinc-800">Xiao Liu</p>
                <p className="text-xs font-mono text-zinc-500 mt-0.5">C_2nj8wk1dv</p>
              </div>
              <span className="text-2xs font-bold text-zinc-600 uppercase tracking-widest mt-0.5">ACTIVE</span>
            </div>

            <Field label="Action">
              <Select
                value={action}
                onChange={onAction}
                placeholder="Select..."
                options={ACTIONS}
                filled={!!action}
              />
            </Field>

            {action === 'Apply adverse action' && (
              <Field label="Reason">
                <Select
                  value={reason}
                  onChange={onReason}
                  placeholder="Select..."
                  options={REASONS}
                  filled={!!reason}
                />
              </Field>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Review Modal ─────────────────────────────────────────────────────────────

function ReviewModal({ suspiciousActivity, escalation, applyAdverse, action, reason, comment, onCancel, onSubmit }: {
  suspiciousActivity: boolean | null
  escalation: boolean | null
  applyAdverse: boolean | null
  action: string
  reason: string
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
          <ReviewSection title="Disposition">
            <div className="grid grid-cols-3 gap-x-10 gap-y-4">
              <ReviewField label="Suspicious activity" value={suspiciousActivity ? 'Yes' : 'No'} />
            </div>
          </ReviewSection>

          <ReviewSection title="Escalation">
            <div className="grid grid-cols-3 gap-x-10 gap-y-4">
              <ReviewField label="Escalate or refer assignment" value={escalation ? 'Yes' : 'No'} />
            </div>
          </ReviewSection>

          <ReviewSection title="Adverse Actions">
            <div className="grid grid-cols-3 gap-x-10 gap-y-4">
              {applyAdverse ? (
                <>
                  <ReviewField label="Adverse action" value={action || '—'} />
                  <ReviewField label="Reason" value={reason || '—'} />
                  <ReviewField label="Account" value="Xiao Liu" sub="C_2nj8wk1dv" />
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

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">{title}</h3>
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-sm text-zinc-500 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

function Select({ value, onChange, placeholder, options, filled }: {
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

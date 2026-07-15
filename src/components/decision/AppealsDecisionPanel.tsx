import { useState } from 'react'
import { X, Clock, ChevronUp } from 'lucide-react'
import clsx from 'clsx'
import { Toggle } from '../ui/Toggle'

const STEPS = [
  { id: 'appeal-decision', label: 'Appeal Decision' },
  { id: 'escalation', label: 'Escalation' },
  { id: 'adverse-actions', label: 'Adverse Actions' },
]

interface AppealsDecisionPanelProps {
  assignmentId: string
  onClose: () => void
  previewStep?: string | null
}

export function AppealsDecisionPanel({ onClose, previewStep }: AppealsDecisionPanelProps) {
  const n = Number(previewStep)

  const [stepId, setStepId] = useState(
    n >= 3 ? 'adverse-actions' : n === 2 ? 'escalation' : 'appeal-decision'
  )
  const [appealDecision, setAppealDecision] = useState(n >= 1 ? 'Overturn adversities' : '')
  const [escalation, setEscalation] = useState(n >= 2 ? 'No' : '')
  const [applyChanges, setApplyChanges] = useState(n >= 3)
  const [meiAction, setMeiAction] = useState(n >= 3 ? 'Revoke denylist' : '')
  const [ssnAction, setSsnAction] = useState(n >= 3 ? 'No change' : '')
  const [xiaoAction, setXiaoAction] = useState(n >= 3 ? 'No change' : '')

  const activeIdx = STEPS.findIndex(s => s.id === stepId)

  const isNextDisabled =
    (stepId === 'appeal-decision' && !appealDecision) ||
    (stepId === 'escalation' && !escalation) ||
    (stepId === 'adverse-actions' && applyChanges && (!meiAction || !ssnAction || !xiaoAction))

  const goNext = () => {
    if (activeIdx < STEPS.length - 1) setStepId(STEPS[activeIdx + 1].id)
  }
  const goBack = () => {
    if (activeIdx > 0) setStepId(STEPS[activeIdx - 1].id)
  }

  const isLast = activeIdx === STEPS.length - 1
  const ctaLabel = isLast
    ? (appealDecision === 'Overturn adversities' ? 'Submit for L2 Review' : 'Submit Decision')
    : 'Next'

  return (
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
          <AppealDecisionStep value={appealDecision} onChange={setAppealDecision} />
        )}
        {stepId === 'escalation' && (
          <EscalationStep value={escalation} onChange={setEscalation} />
        )}
        {stepId === 'adverse-actions' && (
          <AdverseActionsStep
            apply={applyChanges}
            onApply={v => { setApplyChanges(v); setMeiAction(''); setSsnAction(''); setXiaoAction('') }}
            meiAction={meiAction} onMeiAction={setMeiAction}
            ssnAction={ssnAction} onSsnAction={setSsnAction}
            xiaoAction={xiaoAction} onXiaoAction={setXiaoAction}
          />
        )}
      </div>

      {/* Footer */}
      <div className="bg-zinc-50 border-t border-zinc-200">
        <button className="w-full flex items-center justify-between px-5 py-3 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors">
          Investigation Summary*
          <ChevronUp size={14} className="text-zinc-400" />
        </button>
        <div className="flex items-center gap-3 px-5 pb-4">
          <button
            onClick={isNextDisabled ? undefined : (isLast ? () => alert('Decision submitted!') : goNext)}
            disabled={isNextDisabled}
            className={clsx(
              'px-5 py-2 text-sm font-semibold rounded-lg transition-colors shadow-sm',
              isNextDisabled
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
  )
}

// ─── Step 1: Appeal Decision ──────────────────────────────────────────────────

function AppealDecisionStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-4">
      <Field label="What is the outcome of this appeal?">
        <Select
          value={value}
          onChange={onChange}
          placeholder="Select..."
          options={['Overturn adversities', 'Uphold adversities']}
          filled={!!value}
        />
      </Field>
    </div>
  )
}

// ─── Step 2: Escalation ───────────────────────────────────────────────────────

function EscalationStep({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ESCALATION_OPTIONS = ['No', 'Yes, escalate or refer']

  return (
    <div className="space-y-4">
      <Field label="Escalate or refer this account?">
        <Select
          value={value}
          onChange={onChange}
          placeholder="Select..."
          options={ESCALATION_OPTIONS}
          filled={value === 'Yes, escalate or refer'}
        />
      </Field>

      {value === 'Yes, escalate or refer' && (
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

function AdverseActionsStep({
  apply, onApply,
  meiAction, onMeiAction,
  ssnAction, onSsnAction,
  xiaoAction, onXiaoAction,
}: {
  apply: boolean; onApply: (v: boolean) => void
  meiAction: string; onMeiAction: (v: string) => void
  ssnAction: string; onSsnAction: (v: string) => void
  xiaoAction: string; onXiaoAction: (v: string) => void
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-zinc-600 mb-2">Do you want to apply adverse actions?</p>
        <Toggle value={apply} onChange={onApply} />
      </div>

      {apply && (
        <>
          {/* Appealing Account — Mei Chen */}
          <div>
            <p className="text-sm text-zinc-500 mb-2">Appealing Account</p>
            <div className="border border-zinc-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium text-zinc-800">Mei Chen</div>
                  <span className="font-mono text-xs text-zinc-500">C_r4xw8mhkq · AH_m3xw8rkhq</span>
                </div>
                <span className="text-2xs font-bold text-red-600 uppercase tracking-widest shrink-0">DENYLISTED</span>
              </div>
              <p className="text-xs text-zinc-500">Account-level Rise Scam denylist</p>
              <Field label="Select action">
                <Select
                  value={meiAction}
                  onChange={onMeiAction}
                  placeholder="Select..."
                  options={['Revoke denylist', 'No change']}
                  filled={meiAction === 'Revoke denylist'}
                />
              </Field>
            </div>
          </div>

          {/* Shared Identity Evidence */}
          <div>
            <p className="text-sm text-zinc-500 mb-2">Shared Identity Evidence</p>
            <div className="border border-zinc-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium text-zinc-800">SSN ending 6892</div>
                  <span className="font-mono text-xs text-zinc-500">Shared with Xiao Liu · ....a3f2c8d1</span>
                </div>
                <span className="text-2xs font-bold text-red-600 uppercase tracking-widest shrink-0">DENYLISTED</span>
              </div>
              <p className="text-xs text-zinc-500">Rise Scam denylist</p>
              <Field label="Select action">
                <Select
                  value={ssnAction}
                  onChange={onSsnAction}
                  placeholder="Select..."
                  options={['No change', 'Revoke denylist']}
                  filled={ssnAction === 'Revoke denylist'}
                />
              </Field>
              <p className="text-xs text-zinc-400">
                This identity signal remains restricted because it is also associated with a connected suspicious account.
              </p>
            </div>
          </div>

          {/* SSN-Connected Account — Xiao Liu */}
          <div>
            <p className="text-sm text-zinc-500 mb-2">SSN-Connected Account</p>
            <div className="border border-zinc-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium text-zinc-800">Xiao Liu</div>
                  <span className="font-mono text-xs text-zinc-500">C_2nj8wk1dv · Shared SSN · Device</span>
                </div>
                <span className="text-2xs font-bold text-red-600 uppercase tracking-widest shrink-0">DENYLISTED</span>
              </div>
              <p className="text-xs text-zinc-500">Money Mule — Coordinated Network denylist</p>
              <Field label="Select action">
                <Select
                  value={xiaoAction}
                  onChange={onXiaoAction}
                  placeholder="Select..."
                  options={['No change', 'Revoke denylist']}
                  filled={xiaoAction === 'Revoke denylist'}
                />
              </Field>
              <p className="text-xs text-zinc-400">
                This account has independent concerning activity and is not part of the appeal reversal.
              </p>
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

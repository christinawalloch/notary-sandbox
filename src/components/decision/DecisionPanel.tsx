import { useState } from 'react'
import { X, Clock, ChevronUp } from 'lucide-react'
import clsx from 'clsx'
import { Toggle } from '../ui/Toggle'

const STEPS = [
  { id: 'disposition', label: 'Disposition' },
  { id: 'escalation', label: 'Escalation' },
  { id: 'adverse-actions', label: 'Adverse Actions' },
]

interface DecisionPanelProps {
  assignmentId: string
  accountToken: string
  onClose: () => void
}

export function DecisionPanel({ assignmentId: _assignmentId, accountToken, onClose }: DecisionPanelProps) {
  const [stepId, setStepId] = useState('disposition')
  const activeIdx = STEPS.findIndex(s => s.id === stepId)

  const goNext = () => {
    if (activeIdx < STEPS.length - 1) setStepId(STEPS[activeIdx + 1].id)
  }
  const goBack = () => {
    if (activeIdx > 0) setStepId(STEPS[activeIdx - 1].id)
  }

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
        {stepId === 'disposition' && (
          <DispositionStep accountToken={accountToken} />
        )}
        {stepId === 'escalation' && (
          <EscalationStep />
        )}
        {stepId === 'adverse-actions' && (
          <AdverseActionsStep accountToken={accountToken} />
        )}
      </div>

      {/* Footer */}
      <div className="bg-zinc-50 border-t border-zinc-200">
        <button className="w-full flex items-center justify-between px-5 py-3 text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors">
          Investigation Summary*
          <ChevronUp size={14} className="text-zinc-400" />
        </button>
        <div className="flex items-center gap-3 px-5 pb-4">
          {/* Primary button */}
          <button
            onClick={activeIdx === STEPS.length - 1 ? () => alert('Decision submitted!') : goNext}
            className="px-5 py-2 bg-brand hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            {activeIdx === STEPS.length - 1 ? 'Submit' : 'Next'}
          </button>
          {/* Tertiary: text-only */}
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

// ─── Step 1: Disposition ──────────────────────────────────────────────────────

function DispositionStep({ accountToken }: { accountToken: string }) {
  const [unusual, setUnusual] = useState(true)
  const [patternType, setPatternType] = useState('')
  const [pattern, setPattern] = useState('')
  const [products, setProducts] = useState<string[]>([])

  const PATTERN_TYPES = ['EDD', 'SCA', 'TM', 'Other']
  const PATTERNS = ['Other', 'Structuring', 'Layering', 'Rapid Movement']
  const PRODUCT_OPTIONS = ['P2P', 'BNPL', 'Cash BTC Lightning', 'Bill Pay', 'Borrow', 'Investing']

  const removeProduct = (p: string) => setProducts(prev => prev.filter(x => x !== p))
  const addProduct = (p: string) => { if (!products.includes(p)) setProducts(prev => [...prev, p]) }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-zinc-600 mb-2">Is there unusual activity?</p>
        <Toggle value={unusual} onChange={setUnusual} />
      </div>

      {unusual && (
        <div>
          <h3 className="text-base font-bold text-zinc-900 mb-3">Primary Unusual Pattern:</h3>

          <Field label="Unusual Pattern Type:">
            <Select
              value={patternType}
              onChange={setPatternType}
              placeholder="Select..."
              options={PATTERN_TYPES}
            />
          </Field>

          {patternType && (
            <Field label="Unusual Pattern:">
              <Select
                value={pattern}
                onChange={setPattern}
                placeholder="Select..."
                options={PATTERNS}
              />
            </Field>
          )}

          <Field label="Products Involved:" required>
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

          <Field label="Accounts Involved:">
            <span className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-800 text-xs rounded-full font-mono">
              {accountToken}
            </span>
          </Field>

          <button className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-4 py-2 rounded-lg transition-colors mt-1">
            + add unusual pattern
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Step 2: Escalation ───────────────────────────────────────────────────────

function EscalationStep() {
  const [escalation, setEscalation] = useState('No')
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
          onChange={setEscalation}
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

function AdverseActionsStep({ accountToken }: { accountToken: string }) {
  const [apply, setApply] = useState(false)
  const [action, setAction] = useState('')

  const ACTIONS = ['Denylist', 'Apply Strike', 'Revoke Denylist']
  const DENYLIST_REASONS = ['Rise Scam', 'Fraud', 'AML Violation', 'Account Takeover']
  const CATEGORIES = ['Financial Services', 'Marketplace', 'Cash App Pay', 'Borrow']
  const PRODUCTS = ['P2P', 'BNPL', 'Bill Pay', 'Investing']
  const ADVERSITIES = ['Rise Scam - Applied Aug 2025', 'Prior Strike - Jan 2025']
  const REVOCATION_REASONS = ['Insufficient Evidence', 'Successful Appeal', 'Error in Application']

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-zinc-600 mb-2">Do you want to apply adverse actions?</p>
        <Toggle value={apply} onChange={v => { setApply(v); setAction('') }} />
      </div>

      {apply && (
        <>
          <div>
            <p className="text-sm text-zinc-500 mb-2">Alerted Account</p>
            <div className="border border-zinc-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs text-zinc-800 break-all">{accountToken}</span>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-2xs font-bold text-zinc-600 uppercase tracking-widest">ACTIVE</span>
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
                  onChange={setAction}
                  placeholder="Select..."
                  options={ACTIONS}
                  filled={!!action}
                />
              </Field>

              {action === 'Denylist' && (
                <Field label="Select denylist reason(s)">
                  <Select
                    value=""
                    onChange={() => {}}
                    placeholder="Select denylist reason(s)"
                    options={DENYLIST_REASONS}
                  />
                </Field>
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

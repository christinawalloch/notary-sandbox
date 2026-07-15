import type { ReactNode } from 'react'
import { X, ChevronUp } from 'lucide-react'
import clsx from 'clsx'

interface Step {
  id: string
  label: string
}

interface DecisionPanelShellProps {
  assignmentId: string
  title?: string
  steps: Step[]
  activeStep: string
  onStepChange: (id: string) => void
  onClose: () => void
  children: ReactNode
  onNext?: () => void
  onSubmit?: () => void
}

export function DecisionPanelShell({
  assignmentId,
  title = 'Decide',
  steps,
  activeStep,
  onStepChange,
  onClose,
  children,
  onNext,
  onSubmit,
}: DecisionPanelShellProps) {
  const activeIdx = steps.findIndex(s => s.id === activeStep)
  const isLast = activeIdx === steps.length - 1

  return (
    <div className="w-80 shrink-0 border-l border-zinc-200 bg-white flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-zinc-100">
        <div className="flex items-start justify-between mb-1">
          <span className="text-xs text-zinc-400">{assignmentId}</span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-700 rounded hover:bg-zinc-100 transition-colors"
          >
            <X size={15} />
          </button>
        </div>
        <h2 className="text-xl font-bold text-zinc-900">{title}</h2>

        {/* Stepper */}
        <div className="flex items-center gap-1 mt-3 flex-wrap gap-y-2">
          {steps.map((step, idx) => {
            const done = idx < activeIdx
            const active = step.id === activeStep
            return (
              <div key={step.id} className="flex items-center gap-1">
                <button
                  onClick={() => (done ? onStepChange(step.id) : undefined)}
                  className={clsx(
                    'px-3 py-1.5 rounded-full text-2xs font-semibold border transition-colors',
                    active
                      ? 'bg-zinc-900 text-white border-zinc-900'
                      : done
                        ? 'bg-white text-zinc-600 border-zinc-300 hover:border-zinc-400 cursor-pointer'
                        : 'bg-white text-zinc-400 border-zinc-200 cursor-default'
                  )}
                >
                  {idx + 1}. {step.label.toUpperCase()}
                </button>
                {idx < steps.length - 1 && (
                  <span className="text-zinc-300 text-xs">›</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {children}
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-200">
        <button className="w-full flex items-center justify-between px-5 py-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
          Investigation Summary*
          <ChevronUp size={14} className="text-zinc-400" />
        </button>
        <div className="px-5 pb-4">
          <button
            onClick={isLast ? onSubmit : onNext}
            className="px-5 py-2 bg-brand hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {isLast ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

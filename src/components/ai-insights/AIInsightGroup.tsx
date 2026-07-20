import { useState } from 'react'
import { ChevronDown, ChevronRight, Copy, Info, X, ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react'
import type { AIInsightGroup as AIInsightGroupType, AIInsightItem } from '../../data/mock'

const GROUP_CONFIG: Record<string, {
  border: string
  bg: string
  titleClass: string
  countBadge: boolean
}> = {
  'Needs Review':       { border: 'border-zinc-200', bg: 'bg-zinc-50/50', titleClass: 'font-semibold text-zinc-900', countBadge: false },
  'Adverse Signals':    { border: 'border-red-200',  bg: 'bg-red-50/50',  titleClass: 'font-semibold text-zinc-900', countBadge: true  },
  'Mitigating Signals': { border: 'border-zinc-200', bg: 'bg-white',      titleClass: 'font-medium text-zinc-400',   countBadge: false },
}

const YES_OPTIONS = [
  'Finding was accurate',
  'Explanation was clear',
  'Evidence was relevant',
  'Saved investigation time',
  'Other',
]

const NO_OPTIONS = [
  'Finding is inaccurate',
  'Evidence does not support the finding',
  'Important evidence is missing',
  'Explanation is unclear',
  'Insight is not relevant',
  'Duplicate or redundant insight',
  'Other',
]

function FeedbackModal({ item, onClose, onSubmit }: { item: AIInsightItem; onClose: () => void; onSubmit: () => void }) {
  const [rating, setRating] = useState<'yes' | 'no' | null>(null)
  const [yesReasons, setYesReasons] = useState<string[]>([])
  const [yesContext, setYesContext] = useState('')
  const [noReason, setNoReason] = useState<string | null>(null)
  const [noOtherText, setNoOtherText] = useState('')
  const [noDetails, setNoDetails] = useState('')

  const canSubmit =
    rating === 'yes' ||
    (rating === 'no' && noReason !== null && (noReason !== 'Other' || noOtherText.trim().length > 0))

  const toggleYesReason = (r: string) =>
    setYesReasons(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-[520px] p-6" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-zinc-900">Report feedback</span>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <X size={16} />
          </button>
        </div>
        <p className="text-xs text-zinc-500 mb-4 leading-relaxed w-[90%]">
          Your feedback helps us understand whether this insight and its supporting evidence were useful.
        </p>

        {/* Insight context */}
        <div className="mb-4 px-3 py-2.5 bg-zinc-50 rounded-lg border border-zinc-100">
          <p className="text-xs font-semibold text-zinc-800">{item.label}</p>
          <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.finding}</p>
        </div>

        {/* Rating */}
        <p className="text-xs font-medium text-zinc-800 mb-2">Was this insight accurate and useful?</p>
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setRating('yes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              rating === 'yes'
                ? 'bg-green-50 border-green-300 text-green-700'
                : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
            }`}
          >
            <ThumbsUp size={12} /> Yes
          </button>
          <button
            onClick={() => setRating('no')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              rating === 'no'
                ? 'bg-red-50 border-red-300 text-red-700'
                : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
            }`}
          >
            <ThumbsDown size={12} /> No
          </button>
        </div>

        {/* Yes branch */}
        {rating === 'yes' && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-zinc-800 mb-2">
                What was most useful? <span className="text-zinc-400 font-normal">(optional)</span>
              </p>
              <div className="space-y-2">
                {YES_OPTIONS.map(opt => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={yesReasons.includes(opt)}
                      onChange={() => toggleYesReason(opt)}
                      className="rounded border-zinc-300 accent-brand focus:ring-brand focus:ring-offset-0"
                    />
                    <span className="text-xs text-zinc-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-800 mb-1.5">
                Additional context <span className="text-zinc-400 font-normal">(optional)</span>
              </p>
              <textarea
                value={yesContext}
                onChange={e => setYesContext(e.target.value)}
                placeholder="Anything else you'd like to share?"
                className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-700 h-20 resize-none focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>
        )}

        {/* No branch */}
        {rating === 'no' && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-zinc-800 mb-2">What was wrong?</p>
              <div className="space-y-2">
                {NO_OPTIONS.map(opt => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="noReason"
                      value={opt}
                      checked={noReason === opt}
                      onChange={() => { setNoReason(opt); setNoOtherText(''); setNoDetails('') }}
                      className="border-zinc-300 accent-brand focus:ring-brand focus:ring-offset-0"
                    />
                    <span className="text-xs text-zinc-700">{opt}</span>
                  </label>
                ))}
              </div>
              {noReason === 'Other' && (
                <textarea
                  value={noOtherText}
                  onChange={e => setNoOtherText(e.target.value)}
                  placeholder="Please describe the issue."
                  autoFocus
                  className="mt-2.5 w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-700 h-20 resize-none focus:outline-none focus:ring-1 focus:ring-brand"
                />
              )}
            </div>
            {noReason && noReason !== 'Other' && (
              <div>
                <p className="text-xs font-medium text-zinc-800 mb-1.5">
                  Add details that may help us investigate the issue. <span className="text-zinc-400 font-normal">(optional)</span>
                </p>
                <textarea
                  value={noDetails}
                  onChange={e => setNoDetails(e.target.value)}
                  placeholder="Add details..."
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-700 h-20 resize-none focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="text-xs font-medium text-zinc-700 px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={canSubmit ? onSubmit : undefined}
            disabled={!canSubmit}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
              canSubmit
                ? 'bg-brand text-white hover:opacity-90'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
            }`}
          >
            Submit feedback
          </button>
        </div>
      </div>
    </div>
  )
}

export function AIInsightGroup({ group, structuredFeedback = false }: { group: AIInsightGroupType; structuredFeedback?: boolean }) {
  const [open, setOpen] = useState(group.defaultOpen ?? false)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [feedbackItem, setFeedbackItem] = useState<AIInsightItem | null>(null)
  const [toastShowing, setToastShowing] = useState(false)

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const handleSubmitFeedback = () => {
    setFeedbackItem(null)
    setToastShowing(true)
    setTimeout(() => setToastShowing(false), 3000)
  }

  const cfg = GROUP_CONFIG[group.title] ?? GROUP_CONFIG['Needs Review']
  const allExpanded = group.items.length > 0 && group.items.every(i => expandedRows.has(i.id))

  const toggleRow = (id: string) =>
    setExpandedRows(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedRows(new Set())
    } else {
      setExpandedRows(new Set(group.items.map(i => i.id)))
    }
  }

  return (
    <>
      <div className={`${cfg.bg} rounded-xl border ${cfg.border} overflow-hidden`}>
        {/* Group header row */}
        <div className="flex items-center gap-2 px-4 py-3">
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-2 flex-1 min-w-0 text-left"
          >
            {open
              ? <ChevronDown size={13} className="text-zinc-500 shrink-0" />
              : <ChevronRight size={13} className="text-zinc-500 shrink-0" />}
            <span className={`text-sm ${cfg.titleClass}`}>{group.title}</span>
            {cfg.countBadge ? (
              <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-red-100 text-red-600 text-[11px] font-semibold rounded-full leading-none">
                {group.count}
              </span>
            ) : (
              <span className="text-sm text-zinc-400">{group.count}</span>
            )}
          </button>
          {open && (
            <button
              onClick={toggleAll}
              className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors shrink-0"
            >
              {allExpanded ? 'Collapse all' : 'Expand all'}
            </button>
          )}
        </div>

        {/* Items */}
        {open && (
          <div className="px-3 pb-3 pt-1 space-y-1.5">
            {group.items.map(item => {
              const isOpen = expandedRows.has(item.id)
              const hasDetail = !!(item.detailText || item.detailBullets?.length)
              return (
                <div key={item.id} className="flex items-start gap-2 px-3 py-2.5 bg-white rounded-lg">
                  <button
                    onClick={() => toggleRow(item.id)}
                    className="mt-0.5 shrink-0 text-zinc-500 hover:text-zinc-700 transition-colors"
                  >
                    {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-relaxed">
                      <span className="font-semibold text-zinc-800">{item.label}</span>
                      <span className="text-zinc-400"> — </span>
                      <span className="text-zinc-500">{item.finding}</span>
                    </p>
                    {isOpen && hasDetail && (
                      <div className="mt-2 px-3 py-2.5 bg-white rounded-lg text-xs text-zinc-600 leading-relaxed">
                        {item.detailText && <p className={item.detailBullets?.length ? 'mb-2' : ''}>{item.detailText}</p>}
                        {item.detailBullets && (
                          <ul className="space-y-1">
                            {item.detailBullets.map((b, i) => <li key={i}>• {b}</li>)}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <div className="relative group">
                      <button
                        onClick={() => handleCopy(item.id, `${item.label} — ${item.finding}`)}
                        className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-700 transition-colors"
                      >
                        <Copy size={11} />
                      </button>
                      <div className="absolute top-full right-0 mt-1.5 px-2 py-1 bg-zinc-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        {copiedId === item.id ? 'Copied!' : 'Copy'}
                      </div>
                    </div>
                    {structuredFeedback && (
                      <div className="relative group">
                        <button
                          onClick={() => setFeedbackItem(item)}
                          className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-700 transition-colors"
                        >
                          <Info size={11} />
                        </button>
                        <div className="absolute top-full right-0 mt-1.5 px-2 py-1 bg-zinc-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                          Report feedback
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {feedbackItem && (
        <FeedbackModal
          item={feedbackItem}
          onClose={() => setFeedbackItem(null)}
          onSubmit={handleSubmitFeedback}
        />
      )}

      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${toastShowing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}>
        <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-600 rounded-xl shadow-xl">
          <CheckCircle size={16} className="text-white shrink-0" />
          <span className="text-sm font-medium text-white">Feedback submitted</span>
        </div>
      </div>
    </>
  )
}

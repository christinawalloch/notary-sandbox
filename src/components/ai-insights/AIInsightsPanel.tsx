import { useState } from 'react'
import { ChevronDown, ChevronRight, Copy, Info, X, CheckCircle, Minus, Plus } from 'lucide-react'
import { AIInsightGroup } from './AIInsightGroup'
import type { AIInsightGroup as AIInsightGroupType, AIInsightItem } from '../../data/mock'

interface AIInsightsPanelProps {
  groups: AIInsightGroupType[]
  depth?: 'l1' | 'l2' | 'sar'
}

function ReportModal({ onClose, onSend }: { onClose: () => void; onSend: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-[480px] p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-zinc-900">Report issue or feedback</span>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors">
            <X size={16} />
          </button>
        </div>
        <textarea
          className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-500 h-32 resize-none focus:outline-none focus:ring-1 focus:ring-brand"
          placeholder="Describe the issue here."
          autoFocus
        />
        <div className="flex items-center justify-end gap-2 mt-3">
          <button
            onClick={onClose}
            className="text-xs font-medium text-zinc-700 px-3 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSend}
            className="text-xs font-medium text-white bg-brand hover:bg-brand-600 px-3 py-1.5 rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

function FlatInsightRow({
  item,
  open,
  onToggle,
}: {
  item: AIInsightItem
  open: boolean
  onToggle: () => void
}) {
  const [reportOpen, setReportOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [toastShowing, setToastShowing] = useState(false)
  const isFlagged = item.badge === 'flagged'

  const handleCopy = () => {
    const text = [item.label, item.finding, item.detailText, ...(item.detailBullets ?? [])].filter(Boolean).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleSend = () => {
    setReportOpen(false)
    setToastShowing(true)
    setTimeout(() => setToastShowing(false), 3000)
  }
  const hasDetail = !!(item.detailText || item.detailBullets?.length)

  return (
    <>
      <div className={`${isFlagged ? 'bg-red-50/40' : ''}${open && hasDetail ? ' pb-3' : ''}`}>
        <div className="flex items-start gap-2 px-4 py-2.5">
          <button
            onClick={onToggle}
            className="mt-0.5 shrink-0 text-zinc-500 hover:text-zinc-700 transition-colors"
          >
            {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>
          <CheckCircle size={14} className="mt-0.5 shrink-0 text-zinc-500" />
          <div className="flex-1 min-w-0 text-xs leading-relaxed">
            <span className="font-semibold text-zinc-800">{item.label}:</span>{' '}
            {isFlagged && (
              <span className="inline-flex items-center font-bold text-[10px] px-1.5 py-px rounded border bg-red-50 text-red-700 border-red-200 uppercase tracking-wide mr-1 align-middle">
                FLAGGED
              </span>
            )}
            <span className="text-zinc-600">{item.finding}</span>
          </div>
          <div className="flex items-center gap-0.5 shrink-0 ml-1">
            <div className="relative group">
              <button
                onClick={handleCopy}
                className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-700 transition-colors"
              >
                <Copy size={12} />
              </button>
              <div className="absolute top-full right-0 mt-1.5 px-2 py-1 bg-zinc-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                {copied ? 'Copied!' : 'Copy'}
              </div>
            </div>
            <div className="relative group">
              <button
                onClick={() => setReportOpen(true)}
                className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-zinc-700 transition-colors"
              >
                <Info size={12} />
              </button>
              <div className="absolute top-full right-0 mt-1.5 px-2 py-1 bg-zinc-800 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                Report issue
              </div>
            </div>
          </div>
        </div>
        {open && hasDetail && (
          <div className="mx-4 px-4 py-3 bg-white rounded-lg border border-zinc-200 text-xs text-zinc-600 leading-relaxed">
            {item.detailText && <p className={item.detailBullets?.length ? 'mb-2' : ''}>{item.detailText}</p>}
            {item.detailBullets && (
              <ul className="space-y-1">
                {item.detailBullets.map((b, i) => (
                  <li key={i}>• {b}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      {reportOpen && <ReportModal onClose={() => setReportOpen(false)} onSend={handleSend} />}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${toastShowing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}>
        <div className="flex items-center gap-3 px-5 py-3.5 bg-emerald-600 rounded-xl shadow-xl">
          <CheckCircle size={16} className="text-white shrink-0" />
          <span className="text-sm font-medium text-white">Feedback sent</span>
        </div>
      </div>
    </>
  )
}

export function AIInsightsPanel({ groups, depth = 'l1' }: AIInsightsPanelProps) {
  const [panelOpen, setPanelOpen] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const allItems = groups.flatMap(g => g.items)
  const flaggedCount = allItems.filter(i => i.badge === 'flagged').length
  const totalCount = allItems.length
  const allRowsExpanded = allItems.length > 0 && allItems.every(i => expandedRows.has(i.id))

  const toggleRow = (id: string) => setExpandedRows(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const toggleAllRows = () => {
    if (allRowsExpanded) {
      setExpandedRows(new Set())
    } else {
      setExpandedRows(new Set(allItems.map(i => i.id)))
    }
  }

  if (depth === 'l1') {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100">
          <span className="text-base font-bold text-zinc-900">AI Insights</span>
          {flaggedCount > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-px rounded border bg-red-50 text-red-700 border-red-200 uppercase tracking-wide">
              {flaggedCount} Flagged
            </span>
          )}
          <span className="text-xs text-zinc-400 flex-1">
            {totalCount} checks completed • Last updated 3 min ago
          </span>
          <div className="flex items-center gap-4">
            {panelOpen && (
              <>
                <button className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 transition-colors">
                  <Copy size={11} />
                  Copy all flagged text
                </button>
                <button
                  onClick={toggleAllRows}
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 transition-colors"
                >
                  {allRowsExpanded ? <Minus size={11} /> : <Plus size={11} />}
                  {allRowsExpanded ? 'Collapse All Rows' : 'Expand All Rows'}
                </button>
              </>
            )}
            <button
              onClick={() => setPanelOpen(v => !v)}
              className="flex items-center gap-1 text-xs font-medium text-brand hover:opacity-80 transition-opacity shrink-0 whitespace-nowrap"
            >
              {panelOpen ? <Minus size={12} /> : <Plus size={12} />}
              {panelOpen ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
        </div>
        {panelOpen && (
          <div className="divide-y divide-zinc-100">
            {allItems.map(item => (
              <FlatInsightRow
                key={item.id}
                item={item}
                open={expandedRows.has(item.id)}
                onToggle={() => toggleRow(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // Grouped variant (L2, SAR)
  return (
    <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="text-base font-bold text-zinc-900">AI Insights</span>
        <span className="text-xs text-zinc-400">Last updated 3 min ago</span>
      </div>
      <div className="px-3 pb-3 space-y-2">
        {groups.map(group => (
          <AIInsightGroup key={group.id} group={group} structuredFeedback={depth === 'l2'} />
        ))}
      </div>
    </div>
  )
}

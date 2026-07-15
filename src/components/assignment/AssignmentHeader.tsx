import { Link2, MoreHorizontal, Activity, AlertCircle, CornerDownRight } from 'lucide-react'
import { Badge, statusToBadgeVariant } from '../ui/Badge'
import type { Assignment } from '../../data/mock'

interface AssignmentHeaderProps {
  assignment: Assignment
  ctaLabel: 'Claim' | 'Decide'
  onCTA: () => void
  claimed?: boolean
}

export function AssignmentHeader({ assignment, ctaLabel, onCTA, claimed = false }: AssignmentHeaderProps) {
  return (
    <div className="px-6 pt-4 pb-3 shrink-0">
      {/* Title row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <h1 className="text-lg font-bold text-zinc-900 whitespace-nowrap">
            Assignment #{assignment.numericId}
          </h1>
          <button className="text-zinc-400 hover:text-zinc-600 shrink-0" title="Copy link">
            <Link2 size={13} />
          </button>
          <Badge
            variant={claimed ? 'claimed' : statusToBadgeVariant(assignment.status)}
            label={claimed ? 'IN PROGRESS' : assignment.status.toUpperCase()}
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Tertiary: text + icon only */}
          <button className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 px-2.5 py-1.5 rounded hover:bg-white/70 transition-colors">
            <Link2 size={12} />
            Debug
          </button>
          <button className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-700 rounded hover:bg-white/70 transition-colors">
            <MoreHorizontal size={16} />
          </button>
          {/* Secondary: ghost with border */}
          <button className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 transition-colors shadow-sm">
            <Activity size={12} />
            Timeline
          </button>
          {/* Primary: filled green */}
          <button
            onClick={onCTA}
            className="px-4 py-1.5 bg-brand hover:bg-brand-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
          >
            {ctaLabel}
          </button>
        </div>
      </div>

      {/* Meta row — labels black/near-black, values slightly lighter */}
      <div className="flex items-center flex-wrap gap-x-5 gap-y-0.5 mt-1.5 text-xs">
        <span>
          <span className="font-medium text-zinc-900">Created</span>{' '}
          <span className="text-zinc-500">{assignment.createdAt}</span>{' '}
          <span className="text-zinc-400">({assignment.createdRelative})</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="font-medium text-zinc-900">Due</span>{' '}
          <span className={assignment.dueOverdue ? 'text-red-600 font-semibold' : 'text-zinc-500'}>
            {assignment.dueAt}
          </span>
          {assignment.dueOverdue && <AlertCircle size={11} className="text-red-500" />}
          <span className="text-zinc-400">({assignment.dueRelative})</span>
        </span>
        <span>
          <span className="font-medium text-zinc-900">Created By</span>{' '}
          <span className="text-zinc-500">{assignment.createdBy}</span>
        </span>
        <span>
          <span className="font-medium text-zinc-900">Case ID</span>{' '}
          <span className="font-mono text-zinc-500">{assignment.caseId}</span>
          <button className="ml-1 text-zinc-400 hover:text-zinc-600">
            <Link2 size={11} className="inline" />
          </button>
        </span>
      </div>

      {/* Linked / Tags row */}
      <div className="flex items-center gap-4 mt-1 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="font-medium text-zinc-900">Linked Assignments</span>
          <CornerDownRight size={11} className="text-zinc-400" />
          <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 rounded bg-green-100 text-brand text-2xs font-bold leading-none">
            {assignment.linkedAssignments ?? 0}
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="font-medium text-zinc-900">Tags</span>
          <button className="inline-flex items-center justify-center w-4 h-4 rounded bg-zinc-100 text-zinc-500 hover:bg-zinc-200 text-xs font-medium leading-none transition-colors">+</button>
        </span>
      </div>
    </div>
  )
}

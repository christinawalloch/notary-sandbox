import { useState } from 'react'
import { Maximize2, ChevronDown } from 'lucide-react'
import type { TimelineEvent } from '../../data/mock'

interface AssignmentTimelineProps {
  assignmentId: string
  events: TimelineEvent[]
}

export function AssignmentTimeline({ assignmentId: _assignmentId, events }: AssignmentTimelineProps) {
  const [comment, setComment] = useState('')

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Timeline</h3>
          <p className="text-xs text-zinc-500 mt-0.5 max-w-2xl leading-relaxed">
            All changes pertaining to this assignment can be found below. Toggle the dropdown on the right to view assignments in the same case or to view comments separately.
          </p>
        </div>
        <button className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-700 transition-colors shrink-0 ml-6">
          <Maximize2 size={12} />
          View Full Modal
        </button>
      </div>

      <div className="w-3/4">
        <p className="text-xs font-medium text-zinc-700 mb-1.5">Assignment Comment</p>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Record a comment on this assignment..."
          className="w-full h-20 px-3 py-2 text-xs border border-zinc-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-brand/30 placeholder:text-zinc-400"
        />
        <p className="text-xs text-zinc-400 mt-1">Comments are not final dispositions and hashtags have no effect.</p>
        <button className="mt-2 px-3 py-1.5 text-xs font-medium text-zinc-700 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors">
          Add Comment
        </button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-zinc-800">All Activity</span>
          <button className="flex items-center gap-1 text-xs text-zinc-600 bg-zinc-100 rounded-full px-2.5 py-0.5 hover:bg-zinc-200 transition-colors">
            All Activity <ChevronDown size={10} className="ml-0.5" />
          </button>
        </div>
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="flex items-start gap-2.5">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-2xs font-bold shrink-0 mt-0.5"
                style={{ backgroundColor: event.actorColor }}
              >
                {event.actorInitial}
              </div>
              <div className="min-w-0">
                <span className="text-xs text-zinc-700">
                  <span className="font-medium">{event.actorLabel}</span>{' '}
                  <span className="text-zinc-500">{event.action} </span>
                  <span className="font-semibold">{event.field}</span>
                </span>
                <span className="text-xs text-zinc-400 ml-2">{event.timestamp}</span>
                {event.detail && (
                  <div className="text-xs text-zinc-500 mt-0.5">{event.detail}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

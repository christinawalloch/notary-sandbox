import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/shell/AppShell'
import { QUEUES } from '../data/mock'

export default function QueueListPage() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto">
        {/* Breadcrumb */}
        <div className="px-8 pt-5 pb-1 text-xs text-zinc-500 font-medium">
          My Queues
        </div>

        {/* Page header */}
        <div className="px-8 pb-5">
          <h1 className="text-xl font-bold text-zinc-900">My Queues</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Click into an item below to see the assignments for that queue.
          </p>
        </div>

        {/* Table */}
        <div className="mx-8 bg-white border border-zinc-200 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_80px_80px_80px_80px_80px] bg-zinc-50 border-b border-zinc-200 px-6 py-2.5">
            <span className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest">Name</span>
            {['Available', 'Pending', 'Claimed', 'Overdue', 'Total'].map(col => (
              <span key={col} className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest text-right">
                {col}
              </span>
            ))}
          </div>

          {/* Rows */}
          {QUEUES.map((queue) => (
            <button
              key={queue.id}
              onClick={() => navigate(queue.route)}
              className="w-full grid grid-cols-[1fr_80px_80px_80px_80px_80px] px-6 py-3.5 hover:bg-zinc-50 transition-colors border-b border-zinc-100 last:border-0 text-left relative"
            >
              {/* Colored left indicator */}
              <span
                className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                style={{ background: queue.indicatorColor }}
              />

              <div className="pr-8">
                <div className="text-sm font-medium text-zinc-900">{queue.name}</div>
                <div className="text-xs text-zinc-400 mt-0.5">{queue.description}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xs text-zinc-400">{queue.slaLabel}</span>
                  <span className={`text-2xs font-semibold px-1.5 py-0.5 rounded uppercase ${
                    queue.priority === 'High'
                      ? 'bg-red-50 text-red-600'
                      : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    {queue.priority}
                  </span>
                </div>
              </div>

              <Stat value={queue.stats.available} />
              <Stat value={queue.stats.pending} />
              <Stat value={queue.stats.claimed} />
              <Stat value={queue.stats.overdue} highlight={queue.stats.overdue > 0} />
              <Stat value={queue.stats.total} bold />
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  )
}

function Stat({ value, highlight, bold }: { value: number; highlight?: boolean; bold?: boolean }) {
  return (
    <span className={`text-sm text-right self-center ${
      highlight && value > 0 ? 'text-red-600 font-semibold' : bold ? 'text-zinc-900 font-semibold' : 'text-zinc-700'
    }`}>
      {value}
    </span>
  )
}

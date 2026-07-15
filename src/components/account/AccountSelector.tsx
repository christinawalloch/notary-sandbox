import { useState } from 'react'
import clsx from 'clsx'
import { Network, Copy, ChevronDown } from 'lucide-react'
import type { Account, ConnectedAccount } from '../../data/mock'

const EVIDENCE_FILTERS = ['SSN', 'EIN', 'Device', 'IDV', 'Phone', 'Bank Account', 'Debit'] as const

function Avatar({ name, color, size = 'md' }: { name: string; color?: string; size?: 'sm' | 'md' }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div
      className={clsx(
        'rounded-full flex items-center justify-center font-semibold text-white shrink-0 select-none',
        size === 'sm' ? 'w-6 h-6 text-2xs' : 'w-8 h-8 text-xs'
      )}
      style={{ background: color ?? '#6366f1' }}
    >
      {initials}
    </div>
  )
}

interface AccountSelectorProps {
  primarySubject: Account
  connectedSubjects?: ConnectedAccount[]
  selectedId: string
  onSelect: (id: string) => void
}

export function AccountSelector({ primarySubject, connectedSubjects = [], selectedId, onSelect }: AccountSelectorProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const toggle = (f: string) =>
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])

  const filtered = activeFilters.length === 0
    ? connectedSubjects
    : connectedSubjects.filter(s => s.sharedEvidence.some(e => activeFilters.includes(e.type)))

  return (
    <div>
      {/* Section header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Account</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Select the primary subject account or connected accounts to view account details.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 text-xs font-medium text-zinc-900 border border-zinc-200 px-2.5 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors">
            <Network size={12} />
            View Connections Graph
          </button>
          <button className="flex items-center gap-1.5 text-xs font-medium text-zinc-900 border border-zinc-200 px-2.5 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors">
            <Copy size={12} />
            Copy Tokens
          </button>
        </div>
      </div>

      {/* Primary Subject */}
      <div className="text-2xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
        Primary Subject
      </div>
      <label className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors',
        selectedId === primarySubject.id
          ? 'border-brand bg-green-50'
          : 'border-zinc-200 bg-white hover:border-zinc-300'
      )}>
        <input type="radio" name="account-subject" value={primarySubject.id}
          checked={selectedId === primarySubject.id} onChange={() => onSelect(primarySubject.id)}
          className="sr-only" />
        <RadioDot active={selectedId === primarySubject.id} />
        <Avatar name={primarySubject.displayName} color={primarySubject.avatarColor} />
        <span className="font-mono text-xs text-brand">{primarySubject.id}</span>
        <span className="text-sm font-medium text-zinc-900">{primarySubject.displayName}</span>
        {primarySubject.status === 'denylisted' && (
          <span className="relative ml-1 group">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-red-200 bg-red-50 text-2xs font-bold text-red-600 uppercase tracking-wide cursor-default transition-all hover:bg-red-100 hover:border-red-300">
              DENYLISTED
              <ChevronDown size={9} className="shrink-0" />
</span>
            {primarySubject.denylistDetails && (
              <div className="absolute left-0 top-full mt-1.5 z-50 hidden group-hover:block w-72 bg-white border border-zinc-200 rounded-xl shadow-lg p-4 text-xs">
                <div className="font-semibold text-zinc-900 mb-2.5 text-sm">Denylist Details</div>
                <div className="space-y-1.5">
                  {[
                    ['Denied', primarySubject.denylistDetails.deniedDate],
                    ['Reason', primarySubject.denylistDetails.reason],
                    ['Reason Code', primarySubject.denylistDetails.reasonCode],
                    ['Denylisted By', primarySubject.denylistDetails.denylistedBy],
                    ['Appeal Status', primarySubject.denylistDetails.appealStatus],
                    ['Appeal Filed', primarySubject.denylistDetails.appealDate],
                    ['Prior Events', primarySubject.denylistDetails.priorEvents === 0 ? 'None' : String(primarySubject.denylistDetails.priorEvents)],
                    ['Risk Tier', primarySubject.denylistDetails.riskTier],
                    ['Case ID', primarySubject.denylistDetails.caseId],
                  ].filter(([, v]) => v).map(([label, value]) => (
                    <div key={label as string} className="flex items-baseline gap-2">
                      <span className="font-medium text-zinc-500 shrink-0 w-24">{label}</span>
                      <span className={clsx('text-zinc-900', label === 'Reason Code' || label === 'Case ID' ? 'font-mono text-2xs' : '')}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </span>
        )}
      </label>

      {/* Connected Subjects */}
      {connectedSubjects.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1.5 mb-2">
            <span className="text-xs font-semibold text-zinc-700">
              Connected Subjects ({connectedSubjects.length})
            </span>
            <span className="text-xs text-zinc-400">Shared Assets</span>
            {EVIDENCE_FILTERS.map(f => {
              const count = connectedSubjects.filter(s => s.sharedEvidence.some(e => e.type === f)).length
              const on = activeFilters.includes(f)
              return (
                <button key={f} onClick={() => toggle(f)}
                  className="flex items-center gap-1.5 text-2xs font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
                  <span className={clsx(
                    'w-3 h-3 rounded border flex items-center justify-center shrink-0 transition-colors',
                    on ? 'bg-brand border-brand' : 'border-zinc-300 bg-white'
                  )}>
                    {on && <span className="text-white text-[8px] leading-none">✓</span>}
                  </span>
                  {f} ({count})
                </button>
              )
            })}
          </div>

          <div className="space-y-1">
            {filtered.map(subject => (
              <label key={subject.id} className={clsx(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer transition-colors',
                selectedId === subject.id
                  ? 'border-brand bg-green-50'
                  : 'border-zinc-200 bg-white hover:border-zinc-300'
              )}>
                <input type="radio" name="account-subject" value={subject.id}
                  checked={selectedId === subject.id} onChange={() => onSelect(subject.id)}
                  className="sr-only" />
                <RadioDot active={selectedId === subject.id} />
                <Avatar name={subject.displayName} color={subject.avatarColor} size="sm" />
                <span className="font-mono text-xs text-brand">{subject.id}</span>
                <span className="text-sm text-zinc-800">{subject.displayName}</span>
                {subject.verified && (
                  <span className="text-2xs text-brand font-medium">VERIFIED</span>
                )}
                {subject.status === 'denylisted' && (
                  <span className="relative group">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-red-200 bg-red-50 text-2xs font-bold text-red-600 uppercase tracking-wide cursor-default transition-all hover:bg-red-100 hover:border-red-300">
                      DENYLISTED
              <ChevronDown size={9} className="shrink-0" />
        </span>
                    {subject.denylistDetails && (
                      <div className="absolute left-0 top-full mt-1.5 z-50 hidden group-hover:block w-72 bg-white border border-zinc-200 rounded-xl shadow-lg p-4 text-xs">
                        <div className="font-semibold text-zinc-900 mb-2.5 text-sm">Denylist Details</div>
                        <div className="space-y-1.5">
                          {[
                            ['Denied', subject.denylistDetails.deniedDate],
                            ['Reason', subject.denylistDetails.reason],
                            ['Reason Code', subject.denylistDetails.reasonCode],
                            ['Denylisted By', subject.denylistDetails.denylistedBy],
                            ['Prior Events', subject.denylistDetails.priorEvents === 0 ? 'None' : `${subject.denylistDetails.priorEvents} prior events`],
                            ['Risk Tier', subject.denylistDetails.riskTier],
                            ['Case ID', subject.denylistDetails.caseId],
                          ].filter(([, v]) => v).map(([label, value]) => (
                            <div key={label as string} className="flex items-baseline gap-2">
                              <span className="font-medium text-zinc-500 shrink-0 w-24">{label}</span>
                              <span className={clsx('text-zinc-900', label === 'Reason Code' || label === 'Case ID' ? 'font-mono text-2xs' : '')}>{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </span>
                )}
                {subject.sharedEvidence.length > 0 && (
                  <span className="ml-auto flex items-center gap-2 text-zinc-400 text-xs">
                    <span className="text-zinc-400">Shared:</span>
                    {subject.sharedEvidence.map((e, i) => {
                      const highlighted = activeFilters.includes(e.type)
                      return (
                        <span key={i} className={clsx(
                          'text-2xs px-1.5 py-0.5 rounded truncate max-w-[140px] transition-colors',
                          highlighted
                            ? 'bg-brand/10 text-brand font-semibold border border-brand/30'
                            : 'font-mono text-zinc-500 bg-zinc-100'
                        )}>
                          {e.type}: {e.token}
                        </span>
                      )
                    })}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function RadioDot({ active }: { active: boolean }) {
  return (
    <div className={clsx(
      'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
      active ? 'border-brand' : 'border-zinc-300'
    )}>
      {active && <div className="w-2 h-2 rounded-full bg-brand" />}
    </div>
  )
}

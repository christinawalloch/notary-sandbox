import { useState } from 'react'
import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'

interface Email {
  id: string
  direction: 'Inbound' | 'Outbound'
  from: string
  initials: string
  avatarColor: string
  timestamp: string
  preview: string
  full: string
}

const EMAILS: Email[] = [
  {
    id: 'e1',
    direction: 'Inbound',
    from: 'Mei Chen',
    initials: 'MC',
    avatarColor: '#6366f1',
    timestamp: 'Sep 29, 2025 · 9:14 AM',
    preview: 'I believe my account was restricted by mistake. I do not recognize the device or activity connected to this decision.',
    full: 'Hello, I received a notice that my account was restricted for scam-related activity. I believe this was a mistake. I do not recognize the device or activity connected to this decision, and I would like my account reviewed.',
  },
  {
    id: 'e2',
    direction: 'Outbound',
    from: 'Cash App Support',
    initials: 'CA',
    avatarColor: '#12B76A',
    timestamp: 'Sep 29, 2025 · 9:18 AM',
    preview: 'We received your appeal and will review the account and connected activity.',
    full: 'We received your appeal. Our team will review your account, the original restriction, and any relevant connected activity. No additional action is required unless we contact you for more information.',
  },
  {
    id: 'e3',
    direction: 'Outbound',
    from: 'Appeals Operations',
    initials: 'AO',
    avatarColor: '#0ea5e9',
    timestamp: 'Oct 1, 2025 · 2:42 PM',
    preview: 'Please confirm whether you recognize the connected account or device identified during our review.',
    full: 'During our review, we identified a connected account belonging to Xiao Liu and a device ending in 90A1. Please confirm whether you recognize this person, account, or device.',
  },
  {
    id: 'e4',
    direction: 'Inbound',
    from: 'Mei Chen',
    initials: 'MC',
    avatarColor: '#6366f1',
    timestamp: 'Oct 1, 2025 · 4:08 PM',
    preview: 'I do not know Xiao Liu or recognize that device. My previous phone was stolen in July.',
    full: 'I do not know Xiao Liu and have never shared an account with that person. I also do not recognize the device ending in 90A1. My previous phone was stolen in July, and I replaced it shortly afterward.',
  },
  {
    id: 'e5',
    direction: 'Outbound',
    from: 'Appeals Operations',
    initials: 'AO',
    avatarColor: '#0ea5e9',
    timestamp: 'Oct 2, 2025 · 10:31 AM',
    preview: 'Thank you. We added this information to your appeal, which remains under review.',
    full: 'Thank you for confirming. We added this information to your appeal. Your account will remain restricted while the review is completed, and we will contact you when a decision has been made.',
  },
]

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-2xs font-semibold shrink-0 select-none"
      style={{ background: color }}
    >
      {initials}
    </div>
  )
}

function EmailRow({ email }: { email: Email }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className="grid grid-cols-[160px_180px_1fr] gap-x-4 px-4 py-3 border-b border-zinc-100 last:border-b-0 cursor-pointer hover:bg-zinc-50 transition-colors"
      onClick={() => setExpanded(v => !v)}
    >
      {/* Channel */}
      <div className="flex items-start pt-0.5 text-xs text-zinc-700">
        <span>
          Email
          <span className="text-zinc-400"> · </span>
          <span className={email.direction === 'Inbound' ? 'text-zinc-700' : 'text-zinc-500'}>
            {email.direction}
          </span>
        </span>
      </div>

      {/* From */}
      <div className="flex flex-col gap-0.5 items-end">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-900">{email.from}</span>
          <Avatar initials={email.initials} color={email.avatarColor} />
        </div>
        <span className="text-2xs text-zinc-400">{email.timestamp}</span>
      </div>

      {/* Message */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={clsx('text-xs text-zinc-700 leading-relaxed', !expanded && 'line-clamp-2')}>
            {expanded ? email.full : email.preview}
          </p>
        </div>
        <ChevronDown
          size={13}
          className={clsx('text-zinc-400 shrink-0 mt-0.5 transition-transform', expanded && 'rotate-180')}
        />
      </div>
    </div>
  )
}

export function ConversationHistory() {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 px-5 py-4">
      <h3 className="text-sm font-semibold text-zinc-900 mb-4">Conversation history</h3>

      <div>
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
          Emails
        </div>

        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[160px_180px_1fr] gap-x-4 bg-zinc-50 border-b border-zinc-200 px-4 py-2">
            {['CHANNEL', 'FROM', 'MESSAGE'].map(col => (
              <span key={col} className="text-2xs font-semibold text-zinc-400 uppercase tracking-widest">
                {col}
              </span>
            ))}
          </div>

          {EMAILS.map(email => (
            <EmailRow key={email.id} email={email} />
          ))}
        </div>
      </div>
    </div>
  )
}

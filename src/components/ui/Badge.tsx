import clsx from 'clsx'

export type BadgeVariant = 'pending' | 'claimed' | 'overdue' | 'active' | 'denylisted' | 'standby' | 'completed' | 'default'

const variantClasses: Record<BadgeVariant, string> = {
  pending:    'bg-amber-100 text-amber-700 border border-amber-200',
  claimed:    'bg-blue-100 text-blue-700 border border-blue-200',
  overdue:    'bg-red-100 text-red-700 border border-red-200',
  active:     'bg-green-100 text-green-700 border border-green-200',
  denylisted: 'bg-red-100 text-red-700 border border-red-200',
  standby:    'bg-zinc-100 text-zinc-500 border border-zinc-200',
  completed:  'bg-zinc-100 text-zinc-500 border border-zinc-200',
  default:    'bg-zinc-100 text-zinc-500 border border-zinc-200',
}

export function Badge({ variant, label, className }: { variant: BadgeVariant; label: string; className?: string }) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2 py-0.5 rounded text-2xs font-semibold tracking-widest uppercase',
      variantClasses[variant],
      className
    )}>
      {label}
    </span>
  )
}

export function statusToBadgeVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    pending: 'pending', claimed: 'claimed', overdue: 'overdue',
    active: 'active', denylisted: 'denylisted', standby: 'standby', completed: 'completed',
  }
  return map[status] ?? 'default'
}

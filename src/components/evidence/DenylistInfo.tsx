import type { DenylistInfo as DenylistInfoType } from '../../data/mock'

export function DenylistInfo({ info }: { info: DenylistInfoType }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl px-5 py-4">
      <h3 className="text-sm font-semibold text-zinc-900 mb-3">Appeal Context</h3>
      <div>
        <div className="flex items-center flex-wrap gap-x-5 gap-y-0.5 text-xs">
          <span>
            <span className="font-medium text-zinc-900">Appeal source</span>{' '}
            <span className="text-zinc-500">{info.appealSource}</span>
          </span>
          <span>
            <span className="font-medium text-zinc-900">Routing reason</span>{' '}
            <span className="text-zinc-500">{info.routingReason}</span>
          </span>
          <span>
            <span className="font-medium text-zinc-900">Appealed action</span>{' '}
            <span className="text-zinc-500">{info.appealedAction}</span>
          </span>
          <span>
            <span className="font-medium text-zinc-900">Applied by</span>{' '}
            <span className="text-zinc-500">{info.appliedBy}</span>
          </span>
          <span>
            <span className="font-medium text-zinc-900">Denied</span>{' '}
            <span className="text-zinc-500">{info.deniedDate}</span>
          </span>
          <span>
            <span className="font-medium text-zinc-900">Appeal received</span>{' '}
            <span className="text-zinc-500">{info.appealDate}</span>
          </span>
          <span>
            <span className="font-medium text-zinc-900">Active scope</span>{' '}
            <span className="text-zinc-500">{info.activeScope}</span>
          </span>
        </div>
      </div>
    </div>
  )
}


export function DataField({
  label, value, mono, wide, children,
}: {
  label: string
  value?: string
  mono?: boolean
  wide?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className={wide ? 'col-span-2' : undefined}>
      <div className="text-2xs font-semibold text-zinc-400 uppercase tracking-wide mb-1">
        {label}
      </div>
      {children ?? (
        <div className={`text-sm font-medium text-zinc-900 ${mono ? 'font-mono' : ''}`}>
          {value}
        </div>
      )}
    </div>
  )
}

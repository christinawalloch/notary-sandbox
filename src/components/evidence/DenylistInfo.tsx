import type { DenylistInfo as DenylistInfoType } from '../../data/mock'

export function DenylistInfo({ info }: { info: DenylistInfoType }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl px-5 py-4">
      <h3 className="text-sm font-semibold text-zinc-900 mb-3">Denylist Information</h3>
      <div>
        <div className="flex items-center flex-wrap gap-x-5 gap-y-0.5 text-xs">
          <span>
            <span className="font-medium text-zinc-900">Reason</span>{' '}
            <span className="text-zinc-500">{info.reason}</span>
          </span>
          <span>
            <span className="font-medium text-zinc-900">Reason Code</span>{' '}
            <span className="font-mono text-zinc-500">{info.reasonCode}</span>
          </span>
          <span>
            <span className="font-medium text-zinc-900">Country Code</span>{' '}
            <span className="text-zinc-500">{info.countryCode}</span>
          </span>
          <span>
            <span className="font-medium text-zinc-900">Denied Date</span>{' '}
            <span className="text-zinc-500">{info.deniedDate}</span>
          </span>
          <span>
            <span className="font-medium text-zinc-900">Appeal Date</span>{' '}
            <span className="text-zinc-500">{info.appealDate}</span>
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

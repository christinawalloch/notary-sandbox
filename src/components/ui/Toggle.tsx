import clsx from 'clsx'

export function Toggle({
  value,
  onChange,
  labels = ['No', 'Yes'],
}: {
  value: boolean
  onChange: (v: boolean) => void
  labels?: [string, string]
}) {
  return (
    <div className="inline-flex rounded-lg overflow-hidden border border-zinc-200">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={clsx(
          'px-5 py-1.5 text-sm font-medium transition-colors',
          !value ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-600 hover:bg-zinc-50'
        )}
      >
        {labels[0]}
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={clsx(
          'px-5 py-1.5 text-sm font-medium border-l border-zinc-200 transition-colors',
          value ? 'bg-brand text-white' : 'bg-white text-zinc-600 hover:bg-zinc-50'
        )}
      >
        {labels[1]}
      </button>
    </div>
  )
}

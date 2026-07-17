import { useState } from 'react'
import { Copy, Clock, X, Eye, Users, CreditCard } from 'lucide-react'
import clsx from 'clsx'
import type { AssetIdentifier, AssetHistoryEvent } from '../../data/mock'

const ACTION_STYLES: Record<string, string> = {
  Added:                 'bg-zinc-100 text-zinc-600',
  Verified:              'bg-green-100 text-green-700',
  'IDV passed':          'bg-green-100 text-green-700',
  Updated:               'bg-blue-50 text-blue-700',
  Flagged:               'bg-amber-50 text-amber-700',
  Denylisted:            'bg-red-50 text-red-700',
  Unlinked:              'bg-zinc-100 text-zinc-500',
  'Seen on login':       'bg-zinc-50 text-zinc-500',
  'Seen in transaction': 'bg-zinc-50 text-zinc-500',
}

function HistoryModal({ asset, onClose }: { asset: AssetIdentifier; onClose: () => void }) {
  const events: AssetHistoryEvent[] = asset.history ?? [
    { date: asset.added, action: 'Added', actor: 'system' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
      <div
        className="relative bg-white rounded-2xl border border-zinc-200 shadow-xl w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <div>
            <div className="text-sm font-semibold text-zinc-900">{asset.type} History</div>
            <div className="text-xs text-zinc-400 font-mono mt-0.5">{asset.maskedId ?? asset.token}</div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X size={15} />
          </button>
        </div>
        <div className="px-5 py-4 space-y-0 max-h-[420px] overflow-y-auto">
          {events.map((event, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-zinc-300 mt-1 shrink-0" />
                {i < events.length - 1 && <div className="w-px flex-1 bg-zinc-100 mt-1" />}
              </div>
              <div className={`pb-4 min-w-0 ${i === events.length - 1 ? 'pb-1' : ''}`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-2xs font-semibold px-2 py-0.5 rounded uppercase tracking-wide ${ACTION_STYLES[event.action] ?? 'bg-zinc-100 text-zinc-600'}`}>
                    {event.action}
                  </span>
                  {event.actor && <span className="text-2xs text-zinc-400">{event.actor}</span>}
                </div>
                <div className="text-xs text-zinc-500 mt-1">{event.date}</div>
                {event.note && <div className="text-xs text-zinc-600 mt-1 leading-relaxed">{event.note}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Chip({ icon, label, onClick }: { icon?: React.ReactNode; label: string; onClick?: () => void }) {
  const base = 'inline-flex items-center gap-1 text-xs text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1'
  if (onClick) {
    return (
      <button onClick={onClick} className={clsx(base, 'hover:bg-zinc-100 transition-colors')}>
        {icon}{label}
      </button>
    )
  }
  return <span className={base}>{icon}{label}</span>
}

function AssetCard({ asset, onHistoryClick }: { asset: AssetIdentifier; onHistoryClick: () => void }) {
  const isEmail = asset.type.toLowerCase().includes('email')
  const isPhone = asset.type === 'Phone'
  const isSSN = !!(asset.maskedId && asset.fideliusToken)

  return (
    <div className="border border-zinc-200 rounded-xl bg-white px-4 py-3">
      {/* Type + badge */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-800">{asset.type}</span>
        {asset.isDenylisted && (
          <span className="inline-flex text-2xs font-semibold px-1 py-px rounded border whitespace-nowrap bg-red-50 text-red-700 border-red-200">DENYLISTED</span>
        )}
        {asset.isUnlinked && (
          <span className="inline-flex text-2xs font-semibold px-1 py-px rounded border whitespace-nowrap bg-zinc-100 text-zinc-500 border-zinc-200">UNLINKED</span>
        )}
        {!asset.isDenylisted && !asset.isUnlinked && (
          <span className="inline-flex text-2xs font-semibold px-1 py-px rounded border whitespace-nowrap bg-emerald-50 text-emerald-700 border-emerald-200">ACTIVE</span>
        )}
      </div>

      {/* Value */}
      {isSSN ? (
        <div className="flex items-center gap-1.5 text-xs flex-wrap">
          <span className="font-mono text-zinc-800">{asset.maskedId}</span>
          <button className="text-zinc-400 hover:text-zinc-600"><Copy size={11} /></button>
          <span className="text-zinc-300 mx-0.5">•</span>
          <span className="text-zinc-500">Fidelius:</span>
          <span className="font-mono text-zinc-700">{asset.fideliusToken}</span>
          <button className="text-zinc-400 hover:text-zinc-600"><Copy size={11} /></button>
          <button className="text-zinc-400 hover:text-zinc-600"><Eye size={11} /></button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <span className={clsx(
            'text-xs font-mono break-all',
            (isEmail || isPhone) && !asset.isUnlinked ? 'text-brand' : 'text-zinc-800'
          )}>
            {asset.token}
          </span>
          <button className="text-zinc-400 hover:text-zinc-600 shrink-0"><Copy size={11} /></button>
        </div>
      )}

      {/* Date */}
      <div className="text-xs text-zinc-400 mt-1">
        {asset.isUnlinked
          ? `Unlinked ${asset.unlinkedAt}`
          : `Added: ${asset.added}`}
      </div>

      {/* Unlink reason */}
      {asset.isUnlinked && asset.unlinkReason && (
        <div className="text-xs text-zinc-400 mt-0.5">Reason: {asset.unlinkReason}</div>
      )}

      {/* Denylist reason */}
      {asset.denylistReason && (
        <div className="text-xs text-zinc-500 mt-1 leading-relaxed">
          Denylist Reason: {asset.denylistReason}
        </div>
      )}

      {/* Footer chips */}
      {!asset.isUnlinked && (
        <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
          {asset.processorLabel && (
            <Chip icon={<CreditCard size={10} />} label={asset.processorLabel} />
          )}
          {asset.connectedCount != null && (
            <Chip icon={<Users size={10} />} label={`Connected: ${asset.connectedCount}`} />
          )}
          <Chip icon={<Clock size={10} />} label="History" onClick={onHistoryClick} />
        </div>
      )}
    </div>
  )
}

export function AssetsIdentifiers({ assets }: { assets: AssetIdentifier[] }) {
  const [activeAsset, setActiveAsset] = useState<AssetIdentifier | null>(null)

  const current = assets.filter(a => !a.isUnlinked)
  const unlinked = assets.filter(a => a.isUnlinked)

  return (
    <div>
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-zinc-900">Assets &amp; Identifiers</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 items-start">
        <div className="space-y-3">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">
            Current Assets
          </div>
          {current.map(asset => (
            <AssetCard key={asset.id} asset={asset} onHistoryClick={() => setActiveAsset(asset)} />
          ))}
        </div>

        {unlinked.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">
              Unlinked Assets
            </div>
            {unlinked.map(asset => (
              <AssetCard key={asset.id} asset={asset} onHistoryClick={() => setActiveAsset(asset)} />
            ))}
          </div>
        )}
      </div>

      {activeAsset && (
        <HistoryModal asset={activeAsset} onClose={() => setActiveAsset(null)} />
      )}
    </div>
  )
}

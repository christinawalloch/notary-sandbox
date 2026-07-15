import { useState } from 'react'
import { Copy, Clock, ExternalLink, Info, X } from 'lucide-react'
import type { AssetIdentifier, AssetHistoryEvent } from '../../data/mock'

const ACTION_STYLES: Record<string, string> = {
  Added:               'bg-zinc-100 text-zinc-600',
  Verified:            'bg-green-100 text-green-700',
  'IDV passed':        'bg-green-100 text-green-700',
  Updated:             'bg-blue-50 text-blue-700',
  Flagged:             'bg-amber-50 text-amber-700',
  Denylisted:          'bg-red-50 text-red-700',
  Unlinked:            'bg-zinc-100 text-zinc-500',
  'Seen on login':     'bg-zinc-50 text-zinc-500',
  'Seen in transaction': 'bg-zinc-50 text-zinc-500',
}

function HistoryModal({ asset, onClose }: { asset: AssetIdentifier; onClose: () => void }) {
  const events: AssetHistoryEvent[] = asset.history ?? [
    { date: asset.added, action: 'Added', actor: 'system' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
      <div
        className="relative bg-white rounded-2xl border border-zinc-200 shadow-xl w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <div>
            <div className="text-sm font-semibold text-zinc-900">
              {asset.type} History
            </div>
            <div className="text-xs text-zinc-400 font-mono mt-0.5">
              {asset.maskedId ?? asset.token}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Timeline */}
        <div className="px-5 py-4 space-y-0 max-h-[420px] overflow-y-auto">
          {events.map((event, i) => (
            <div key={i} className="flex gap-3">
              {/* Vertical line + dot */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-zinc-300 mt-1 shrink-0" />
                {i < events.length - 1 && (
                  <div className="w-px flex-1 bg-zinc-100 mt-1 mb-0" />
                )}
              </div>

              {/* Content */}
              <div className={`pb-4 min-w-0 ${i === events.length - 1 ? 'pb-1' : ''}`}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-2xs font-semibold px-2 py-0.5 rounded uppercase tracking-wide ${ACTION_STYLES[event.action] ?? 'bg-zinc-100 text-zinc-600'}`}
                  >
                    {event.action}
                  </span>
                  {event.actor && (
                    <span className="text-2xs text-zinc-400">{event.actor}</span>
                  )}
                </div>
                <div className="text-xs text-zinc-500 mt-1">{event.date}</div>
                {event.note && (
                  <div className="text-xs text-zinc-600 mt-1 leading-relaxed">{event.note}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AssetCard({ asset, onHistoryClick }: { asset: AssetIdentifier; onHistoryClick: () => void }) {
  return (
    <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 border-b border-zinc-200">
        <span className="text-xs font-medium text-zinc-700">
          {asset.type} ({asset.tokenShort})
        </span>
        {asset.isDenylisted && (
          <span className="text-2xs font-bold text-red-600 uppercase tracking-wide">
            DENYLISTED
          </span>
        )}
      </div>
      <div className="px-4 py-3">
        {asset.maskedId ? (
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="font-mono text-zinc-800">{asset.maskedId}</span>
            <button className="text-zinc-400 hover:text-zinc-600 shrink-0">
              <Copy size={11} />
            </button>
            {asset.fideliusToken && (
              <>
                <span className="text-zinc-500">Fidelius:</span>
                <span className="font-mono text-zinc-600">{asset.fideliusToken}</span>
                <button className="text-zinc-400 hover:text-zinc-600 shrink-0">
                  <Copy size={11} />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {asset.hasExternalLink ? (
              <span className="text-xs text-brand font-mono">{asset.token}</span>
            ) : (
              <span className="font-mono text-xs text-zinc-800 break-all">{asset.token}</span>
            )}
            {asset.hasExternalLink && <ExternalLink size={11} className="text-brand shrink-0" />}
            {asset.hasInfoIcon && <Info size={11} className="text-zinc-400 shrink-0" />}
            {!asset.hasExternalLink && (
              <button className="text-zinc-400 hover:text-zinc-600 shrink-0">
                <Copy size={11} />
              </button>
            )}
          </div>
        )}

        <div className="text-xs text-zinc-500 mt-1">Added: {asset.added}</div>

        {asset.denylistReason && (
          <div className="text-xs text-zinc-500 mt-0.5">
            Denylist Reason: {asset.denylistReason}
          </div>
        )}

        {!asset.isDenylisted && (
          <button
            onClick={onHistoryClick}
            className="flex items-center gap-1.5 mt-2.5 text-xs text-zinc-500 hover:text-zinc-800 border border-zinc-200 rounded-lg px-2.5 py-1 hover:bg-zinc-50 transition-colors"
          >
            <Clock size={10} />
            History
          </button>
        )}
      </div>
    </div>
  )
}

export function AssetsIdentifiers({ assets }: { assets: AssetIdentifier[] }) {
  const [activeAsset, setActiveAsset] = useState<AssetIdentifier | null>(null)

  const current = assets.filter(a => !a.isUnlinked)
  const unlinked = assets.filter(a => a.isUnlinked)

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-zinc-900">Assets &amp; Identifiers</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 items-start">
        {/* Current Assets */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">
            Current Assets
          </div>
          {current.map(asset => (
            <AssetCard key={asset.id} asset={asset} onHistoryClick={() => setActiveAsset(asset)} />
          ))}
        </div>

        {/* Unlinked Assets */}
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

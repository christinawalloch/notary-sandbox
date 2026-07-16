import { ImageOff } from 'lucide-react'

function DLCard({ side }: { side: 'front' | 'back' }) {
  return (
    <div className="relative rounded-xl overflow-hidden border border-zinc-200 select-none" style={{ width: 296, height: 186 }}>
      {side === 'front' ? (
        <div className="w-full h-full bg-gradient-to-br from-blue-700 to-blue-900 text-white flex flex-col" style={{ fontFamily: 'monospace' }}>
          <div className="flex items-center justify-between px-3 pt-2.5 pb-1 border-b border-blue-500">
            <div>
              <div className="text-[9px] font-bold tracking-widest uppercase text-blue-200">California</div>
              <div className="text-[7px] tracking-wider text-blue-300 uppercase">Driver License</div>
            </div>
            <div className="text-[8px] text-blue-300 text-right">
              <div>DL D1234567</div>
              <div className="text-blue-400">EXP 03/14/2029</div>
            </div>
          </div>

          <div className="flex flex-1 gap-2 px-3 py-2">
            <div className="bg-blue-800 rounded w-[52px] h-[68px] shrink-0 flex items-end justify-center border border-blue-600">
              <div className="w-8 h-8 rounded-full bg-blue-600 mb-1" />
            </div>
            <div className="flex flex-col gap-0.5 text-[7px] min-w-0">
              <div>
                <span className="text-blue-300 uppercase tracking-wider">Name </span>
                <span className="text-white font-bold">MEI CHEN</span>
              </div>
              <div>
                <span className="text-blue-300 uppercase tracking-wider">DOB </span>
                <span className="text-white">03/14/1990</span>
              </div>
              <div>
                <span className="text-blue-300 uppercase tracking-wider">ISS </span>
                <span className="text-white">01/11/2024</span>
              </div>
              <div className="mt-1 text-blue-300 leading-tight">
                847 CLEMENT ST<br />
                SAN FRANCISCO CA 94118
              </div>
            </div>
          </div>

          <div className="px-3 pb-2">
            <div className="h-3 bg-blue-800 rounded flex items-center px-1 gap-0.5 overflow-hidden">
              {Array.from({ length: 60 }).map((_, i) => (
                <div key={i} className="shrink-0 bg-blue-600 rounded-sm" style={{ width: i % 3 === 0 ? 2 : 1, height: i % 5 === 0 ? 10 : 7 }} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full bg-zinc-100 flex flex-col" style={{ fontFamily: 'monospace' }}>
          <div className="h-8 bg-zinc-800 mt-4 w-full" />
          <div className="mx-3 mt-3 h-6 bg-white border border-zinc-300 rounded flex items-center px-2">
            <div className="text-[7px] text-zinc-400 italic">Authorized Signature</div>
          </div>
          <div className="mx-3 mt-auto mb-3 flex gap-px h-12 items-end overflow-hidden">
            {Array.from({ length: 80 }).map((_, i) => (
              <div
                key={i}
                className="bg-zinc-800 shrink-0"
                style={{ width: i % 4 === 0 ? 2 : 1, height: `${40 + (i % 7) * 3}%` }}
              />
            ))}
          </div>
          <div className="text-center text-[6px] text-zinc-400 pb-2 tracking-wider uppercase">
            California DMV · PDF417
          </div>
        </div>
      )}

      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ transform: 'rotate(-25deg)' }}
      >
        <span
          className="text-white font-black tracking-[0.2em] uppercase select-none"
          style={{ fontSize: 36, opacity: 0.18 }}
        >
          SAMPLE
        </span>
      </div>

      <div
        className="absolute bottom-1.5 right-2 text-[7px] font-semibold uppercase tracking-widest"
        style={{ color: side === 'front' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.25)' }}
      >
        {side}
      </div>
    </div>
  )
}

const ACCOUNT_IDS_WITH_ID: Record<string, boolean> = {
  'C_r4xw8mhkq': true,
}

export function GovernmentIDImages({ accountId, standalone }: { accountId: string; standalone?: boolean }) {
  const hasID = ACCOUNT_IDS_WITH_ID[accountId] ?? false

  const inner = (
    <>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-zinc-900">Government ID Images</h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          Identity documents submitted during verification.
        </p>
      </div>

      {hasID ? (
        <div className="flex flex-col gap-3">
          <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest">CA Driver License</div>
          <div className="flex gap-4 flex-wrap">
            <DLCard side="front" />
            <DLCard side="back" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center border border-zinc-200 rounded-xl">
          <ImageOff size={20} className="text-zinc-300" />
          <p className="text-xs text-zinc-400">No verified government ID available</p>
        </div>
      )}
    </>
  )

  if (standalone) {
    return <div className="bg-white rounded-xl border border-zinc-200 px-5 py-4">{inner}</div>
  }
  return <div>{inner}</div>
}

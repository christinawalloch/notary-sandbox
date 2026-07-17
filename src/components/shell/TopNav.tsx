import { Search, Moon } from 'lucide-react'

export function TopNav() {
  return (
    <header className="h-12 bg-white border-b border-zinc-200 flex items-center px-4 gap-4 shrink-0 z-10">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-[32px] h-7 ml-px bg-zinc-900 rounded-md flex items-center justify-center overflow-hidden shrink-0">
          <svg width="18" height="16" viewBox="-3 0 46 28" fill="none">
            <line x1="0"  y1="31" x2="12" y2="-3" stroke="white" strokeWidth="4.5" strokeLinecap="butt"/>
            <line x1="14" y1="31" x2="26" y2="-3" stroke="white" strokeWidth="4.5" strokeLinecap="butt"/>
            <line x1="28" y1="31" x2="40" y2="-3" stroke="white" strokeWidth="4.5" strokeLinecap="butt"/>
          </svg>
        </div>
        <span className="font-bold text-base text-zinc-900 tracking-tight">Notary</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-lg mx-auto">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search"
            className="w-full h-8 pl-8 pr-3 bg-zinc-100 rounded-lg text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-brand/20 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 shrink-0">
<button className="text-sm text-zinc-600 hover:text-zinc-900 font-medium px-3 py-1.5 rounded hover:bg-zinc-100 transition-colors">
          Open Toolbox
        </button>
        <button className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-600 rounded hover:bg-zinc-100 transition-colors">
          <Moon size={16} />
        </button>
        <div className="flex items-center gap-1.5 ml-1 pl-2 pr-3 py-1 rounded-lg border border-zinc-200 bg-white select-none">
          <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="5.5" r="3"/>
              <path d="M2 15c0-3.3 2.7-6 6-6s6 2.7 6 6z"/>
            </svg>
          </div>
          <span className="text-sm font-medium text-zinc-800">cwalloch</span>
        </div>
      </div>
    </header>
  )
}

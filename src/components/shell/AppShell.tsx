import type { ReactNode } from 'react'
import { TopNav } from './TopNav'
import { LeftNav } from './LeftNav'
import type { NavItem } from '../../config/workflows'

interface AppShellProps {
  children: ReactNode
  navItems?: NavItem[]
  activeNavItem?: string
  onNavSelect?: (id: string) => void
}

export function AppShell({ children, navItems, activeNavItem, onNavSelect }: AppShellProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        {navItems && navItems.length > 0 && (
          <LeftNav
            items={navItems}
            activeId={activeNavItem ?? navItems[0]?.id}
            onSelect={onNavSelect ?? (() => {})}
          />
        )}
        <div className="flex-1 flex overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

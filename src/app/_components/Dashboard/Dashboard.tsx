// components/layout/Dashboard.tsx
'use client'

import { useState } from 'react'
import type { Session } from 'next-auth'
import Header from './Header'
import SideBar from './SideBar';

export default function Dashboard({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  const [menuSidebarOpen, setMenuSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <Header session={session} setMenuSidebarOpen={setMenuSidebarOpen} menuSidebarOpen={menuSidebarOpen}/>
      <div className="flex-1 flex flex-row">
        <SideBar menuSidebarOpen={menuSidebarOpen}/>
        {/* Main children content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
      </div>
    </div>
  )
}

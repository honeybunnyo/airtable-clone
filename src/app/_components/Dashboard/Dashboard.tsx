'use client'

import { useState } from 'react'
import Header from './Header'
import SideBar from './SideBar';
import Cards from './Cards';

export default function Dashboard() {
  const [menuSidebarOpen, setMenuSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <Header setMenuSidebarOpen={setMenuSidebarOpen} menuSidebarOpen={menuSidebarOpen}/>
        <div className="flex-1 flex flex-row">
          <SideBar menuSidebarOpen={menuSidebarOpen}/>
          {/* Main children content */}
          <main className="flex-1 overflow-auto bg-gray-50 p-10">
            <h1 className='font-bold text-3xl'>
              Home
            </h1>
            <Cards/>
          </main>
        </div>
      </div>
    </div>
  )
}

import { type LucideIcon , House, BookOpen, ShoppingBag, Upload, SquarePlus } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import CreateBaseButton from './CreateBaseButton';

type SideBarProps = {
  menuSidebarOpen: boolean;
};

// If sidebar was opened by menu icon, only close by menu icon
// Otherwise, sidebar closes if not hovering over
const SideBar = ({ menuSidebarOpen }: SideBarProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(menuSidebarOpen)

  useEffect(() => {
    setSidebarOpen(menuSidebarOpen);
  }, [menuSidebarOpen]);
  
  const trySetSidebarOpen = (open: boolean) => {
    if (!menuSidebarOpen) {
      setSidebarOpen(open)
    }
  }

  return (
    <div
      onMouseEnter={() => trySetSidebarOpen(true)}
      onMouseLeave={() => trySetSidebarOpen(false)}
      className="h-full"
    >
      <aside
        className={`transition-all duration-200 bg-white overflow-hidden border-r border-slate-200 h-full z-0 ${
          sidebarOpen ? 'w-[300px]' : 'w-[50px]'
        } flex flex-col justify-between`}
      >
        {/* Top */}
        <nav className="flex flex-col gap-1 p-2">
          <Link
            href="/"
            className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded text-sm"
          >
            {sidebarOpen ? noWrapText('Home') : <House className="w-5 h-5" />}
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded text-sm"
          >
            {sidebarOpen ? (
              noWrapText('All workspaces')
            ) : (
              <Image
                src="/users-three.svg"
                alt="Users icon"
                width={20}
                height={20}
                className="cursor-pointer"
              />
            )}
          </Link>
          {!sidebarOpen && <div className='h-[1px] w-auto px-1 bg-gray-200'/>}
        </nav>

        {/* Bottom */}
        <div
          className={`${
            !sidebarOpen ? 'items-center' : 'p-3'
          } flex flex-col justify-center`}
        >
          {bottomNav(BookOpen, 'Templates and apps', sidebarOpen)}
          {bottomNav(ShoppingBag, 'Marketplace', sidebarOpen)}
          {bottomNav(Upload, 'Import', sidebarOpen)}
          <div className="mt-4">
            {sidebarOpen ? <CreateBaseButton />
            : <SquarePlus className="w-7 h-7 text-gray-400 mb-4" strokeWidth={1} />}
          </div>
        </div>
      </aside>
    </div>
  )
}

const bottomNav = (Icon: LucideIcon, text: string, sidebarOpen: boolean) => (
  <h4 className="flex flex-row items-center text-xs text-slate-800 hover:bg-slate-100 py-2 gap-2 rounded">
    <Icon className="w-4 h-4" strokeWidth={1} />
    {sidebarOpen && noWrapText(text)}
  </h4>
)

const noWrapText = (text: string) => (
  <span className="whitespace-nowrap overflow-hidden">
    {text}
  </span>
)

export default SideBar
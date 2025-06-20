'use client'

import { Menu, Search, Bell, HelpCircle} from 'lucide-react'
import Image from 'next/image'
import UserMenu from './UserMenu'
import { useSession } from 'next-auth/react'

type SideBarProps = {
  menuSidebarOpen: boolean;
  setMenuSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header = ({ menuSidebarOpen, setMenuSidebarOpen }: SideBarProps) => {
  const { data: session } = useSession()
  return (
    <header className="z-10 flex items-center justify-between px-4 py-0 bg-white shadow-xs border-b border-gray-200 h-14">
      {/* Left */}
      <div className="flex items-center gap-4 min-w-30 no-highlight">
        <div className="hidden md:block">
          <Menu className="w-5 h-5 cursor-pointer text-gray-400 hover:text-gray-800" onClick={() => setMenuSidebarOpen(!menuSidebarOpen)} />
        </div>
        <Image src="/airtable-logo.png" alt="Airtable" width={96} height={30} style={{ height: 'auto', width: '100%' }} priority/>
      </div>

      {/* Center */}
      <div className="flex-1 mx-auto w-auto max-w-[354px] min-w-[130px] ">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-4 h-4" />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 select-none">
            ctrl K
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full border text-sm border-gray-300 rounded-4xl pl-10 pr-16 py-2 h-[32px] hover:shadow-md"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer">
          <HelpCircle className="w-4 h-4" />
        </div>
        <div className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer inset-ring-1 inset-ring-gray-100">
          <Bell className="w-4 h-4" />
        </div>
          {session?.user?.image && (
            <UserMenu session={session} />
          )}
      </div>
    </header>
  )
}

export default Header
import { Search, X } from 'lucide-react'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

const SearchBar = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <Search className="h-4 w-4 mr-4" strokeWidth={1}/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-76 rounded-xs p-0 translate-x-[-20px] translate-y-[10px]" align="start">
        {/* Top half */}
        <div className="px-2 py-1 h-9 flex flex-row justify-between items-center">
          <input placeholder="Find in view" className="text-sm font-bold focus:outline-none"/>
          <button>
            <X strokeWidth={1} className="text-gray-500 h-5 w-5" />
          </button>
        </div>
        {/* bottom half */}
        <div className="px-2 py-1 h-8 flex flex-row items-center bg-gray-100">
          <span className="text-xs text-gray-700">Use advanced search options</span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SearchBar
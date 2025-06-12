import { Search, X } from 'lucide-react'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

const SearchBar = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <Search className="h-4 w-4" strokeWidth={1}/>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 h-30 rounded-xs" align="start">
        <div className='px-1'>
          <input placeholder='Find in view' className='text-sm'/>
          <X strokeWidth={1}/>
        </div>
       
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SearchBar
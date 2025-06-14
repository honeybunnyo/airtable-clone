import { ChevronDown, ChevronUp, Search, X } from 'lucide-react'
import React, { useState } from 'react'
import type { SearchBarProps } from '~/app/types/props'

const SearchBar = ({ searchBarOpen, setSearchBarOpen, searchValue, setSearchValue, matchingCells }: SearchBarProps) => {
  const [currentIndex, setCurrentIndex] = useState(1)
  const totalMatches = matchingCells ? matchingCells.length : 0
  
  return (
    <div>
      <button onClick={()=> setSearchBarOpen(prev => !prev)}>
        <Search className="h-4 w-4 mr-4" strokeWidth={1}/>
      </button>
      {searchBarOpen &&
        <div className="z-20 w-76 rounded-xs p-0 absolute top-34 right-10 outline-2 outline-gray-200">
          {/* Top half*/}
          <div className="bg-white px-2 py-1 h-10 flex flex-row justify-between items-center">
            {/* left*/}
            <input 
            placeholder="Find in view" 
            className="text-sm font-bold focus:outline-none w-30"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            />
            {/* right*/}
            <div className="flex flex-row text-gray-400 text-xs justify-between items-center gap-2">
              <span className="flex flex-row text-gray-400 text-xs whitespace-nowrap">
                {currentIndex} of {totalMatches}
              </span>
              <div className="flex flex-row rounded-sm justify-between items-center">
                <ChevronDown className="h-5 w-5 text-gray-700 bg-gray-200"/>
                <ChevronUp className="h-5 w-5 text-gray-700 bg-gray-200"/>
              </div>
              <button onClick={()=> setSearchBarOpen(false)}>
                <X strokeWidth={1} className="text-gray-500 h-5 w-5" />
              </button>
            </div>
          </div>
          {/* bottom half */}
          <div className="px-2 py-1 h-9 flex flex-row items-center bg-gray-100">
            <span className="text-xs text-gray-700">Use advanced search options</span>
          </div>
        </div>
      }
    </div>
  )
}

export default SearchBar
import { Search, X } from 'lucide-react'
import React from 'react'

type PageProps = {
  searchBarOpen: boolean;
  setSearchBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}

const SearchBar = ({ searchBarOpen, setSearchBarOpen, searchValue, setSearchValue }: PageProps) => {
  return (
    <div>
      <button onClick={()=> setSearchBarOpen(prev => !prev)}>
        <Search className="h-4 w-4 mr-4" strokeWidth={1}/>
      </button>
      {searchBarOpen &&
        <div className="z-20 w-76 rounded-xs p-0 absolute top-34 right-10 outline-2 outline-gray-100">
          {/* Top half */}
          <div className="bg-white px-2 py-1 h-10 flex flex-row justify-between items-center">
            <input 
            placeholder="Find in view" 
            className="text-sm font-bold focus:outline-none"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            />
            <button onClick={()=> setSearchBarOpen(false)}>
              <X strokeWidth={1} className="text-gray-500 h-5 w-5" />
            </button>
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
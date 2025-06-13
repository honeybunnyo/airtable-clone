import { Search, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { api } from '~/trpc/react'
import { useParams } from 'next/navigation'

const SearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);

  const params = useParams();
  const tableId = typeof params?.tableId === "string" ? params.tableId : undefined;

  if (!tableId) return <div>Waiting for tableId...</div>;

  const enabled = !!searchValue && !!tableId && open;

  const { data: matchingCells, isLoading, isSuccess } = api.filter.search.useQuery(
    { tableId, searchValue },
    { enabled }
  );

  useEffect(() => {
    if (isSuccess && matchingCells) {
      console.log("Matching cells:", matchingCells);
    }
  }, [isSuccess, matchingCells]);

  return (
    <div>
      <button onClick={()=> setOpen(prev => !prev)}>
        <Search className="h-4 w-4 mr-4" strokeWidth={1}/>
      </button>
      {open &&
        <div className="z-20 w-76 rounded-xs p-0 absolute top-34 right-10 outline-2 outline-gray-100">
          {/* Top half */}
          <div className="bg-white px-2 py-1 h-10 flex flex-row justify-between items-center">
            <input 
            placeholder="Find in view" 
            className="text-sm font-bold focus:outline-none"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            />
            <button onClick={()=> setOpen(false)}>
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
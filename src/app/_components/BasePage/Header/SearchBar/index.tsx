import { ChevronDown, ChevronUp, Search, X } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { SearchBarProps } from '~/app/types/props'
import LoadingSpinner from '../../../Common/LoadingSpinner'

const SearchBar = ({
  searchBarOpen,
  setSearchBarOpen,
  searchValue, 
  setSearchValue, 
  matchingCells,
  isMatchingLoading,
  matchingColumns,
  scrollToRow
}: SearchBarProps) => {
  const [currentIndex, setCurrentIndex] = useState(1)
  const allMatches = useMemo(() => {
    return [
      ...matchingColumns.map((col) => ({
        id: col.id,
        type: 'column' as const,
      })),
      ...matchingCells.map((cell) => ({
        rowId: cell.rowId,
        columnId: cell.columnId,
        type: 'cell' as const,
      })),
    ];
  }, [matchingColumns, matchingCells]);


  const totalMatches = allMatches.length;
  const inputRef = useRef<HTMLInputElement>(null);
    const currentMatch = allMatches[currentIndex - 1];

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalMatches));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 1));
  };

  useEffect(() => {
    setCurrentIndex(1);
  }, [searchValue])

  
  // Navigate to index i, and highlight focused element
  useEffect(() => {
    matchingCells.forEach((cell) => {
      const el = document.getElementById(`${cell.rowId}-${cell.columnId}`);
      if (el) {
        el.classList.remove("current-highlight");
      }
    });
    matchingColumns.forEach((col) => {
      const el = document.getElementById(col.id);
      if (el) {
        el.classList.remove("current-highlight");
      }
    });

    if (!currentMatch) return;

    // If match is a cell, scroll to row first
    if (currentMatch.type === "cell") {
      scrollToRow(currentMatch.rowId);
      // Give time for scroll
      setTimeout(() => {
        const el = document.getElementById(`${currentMatch.rowId}-${currentMatch.columnId}`);
        if (el) {
          el.classList.add("current-highlight");
          el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 30);
    } else {
      const el = document.getElementById(currentMatch.id);
      if (el) {
        el.classList.add("current-highlight");
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, matchingCells, matchingColumns, allMatches]);


  useEffect(() => {
    if (searchBarOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [searchBarOpen]);

  const BottomHalf = () => {
    return  (
      <div className="px-2 py-1 h-9 flex flex-row items-center bg-gray-100">
        <span className="text-xs text-gray-700">
          {matchingColumns.length === 0 && matchingCells.length === 0 ? 
            <span>Use advanced search options</span>
            :
            <span>
              Found {matchingColumns.length === 0? 'no':<b>{matchingColumns.length}</b>} field{matchingColumns.length === 1 ?'':'s'} and {matchingCells.length === 0? 'no':<b>{matchingCells.length}</b>} cell{matchingCells.length === 1 ?'':'s'}
            </span>
          }
        </span>
      </div>
    )     
  }

  return (
    <div>
      <button onClick={()=> setSearchBarOpen(prev => !prev)}>
        <Search className="h-5 w-5 mr-4 mt-2 text-gray-700 hover:text-black" strokeWidth={1}/>
      </button>
      {searchBarOpen &&
        <div className="z-50 w-76 rounded-xs p-0 absolute top-34 right-10 outline-2 outline-gray-200">
          {/* Top half*/}
          <div className="bg-white px-2 py-1 h-10 flex flex-row justify-between items-center">
            {/* left*/}
            <input
            ref={inputRef}
            placeholder="Find in view" 
            className="text-sm font-medium focus:outline-none w-30"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {if (e.key === 'Enter') handleNext()}}/>
            {/* right*/}
            <div className="flex flex-row text-gray-400 text-xs justify-between items-center gap-2">
              {isMatchingLoading && <LoadingSpinner/>}
              {!isMatchingLoading && searchValue &&
                <>
                  <span className="flex flex-row text-gray-400 text-xs whitespace-nowrap">
                    {totalMatches === 0 ? '0' : currentIndex} of {totalMatches}
                  </span>
                  <div className="flex flex-row rounded-sm justify-between items-center">
                    <button disabled={currentIndex == totalMatches} onClick={handleNext} className="bg-gray-200">
                      <ChevronDown
                        className={`h-5 w-5 ${currentIndex === totalMatches ? "text-gray-300" : "text-gray-600 hover:text-gray-600"}`}/>               
                    </button>
                    <button disabled={currentIndex == 1} onClick={handlePrev} className="bg-gray-200">
                      <ChevronUp
                        className={`h-5 w-5 ${currentIndex === 1 ? "text-gray-300" : "text-gray-600 hover:text-gray-600"}`}/>               
                    </button>
                  </div>
                </>
              }
              <button onClick={()=> setSearchBarOpen(false)}>
                <X strokeWidth={1} className="text-gray-500 h-5 w-5" />
              </button>
            </div>
          </div>
          {/* bottom half */}
          <BottomHalf/>
        </div>
      }
    </div>
  )
}

export default SearchBar
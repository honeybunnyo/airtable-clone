'use client'

import React, { useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { api } from '~/trpc/react';
import Header from '~/app/_components/BasePage/Header';
import ViewSideBar from '~/app/_components/BasePage/ViewSidebar';
import BaseLoadingPage from './../../loading/page';
import DataTable from '~/app/_components/BasePage/Table';

const BasePage = () => {
  const { baseId, tableId: rawTableId } = useParams();
  const tableId = Array.isArray(rawTableId) ? rawTableId[0] : rawTableId ?? "";

  const [ sideBarOpen, setSideBarOpen ] = useState(false);
  const [ searchBarOpen, setSearchBarOpen ] = useState(false);
  const [ searchValue, setSearchValue ] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const enabled = !!searchValue && !!tableId && searchBarOpen;

  const { data: base, isLoading, isError } = api.base.getBaseById.useQuery(
    { id: baseId as string },
    { enabled: !!baseId }
  )
  
  const { data: matches, isLoading: isMatchingLoading } = api.filter.search.useQuery(
    { tableId: tableId ?? "", searchValue },
    { enabled }
  );

  const matchingCells = matches?.matchingCells ?? [];
  const matchingColumns = matches?.matchingColumns ?? [];

  // Map rowId to index for scrolling to (used in SearchBar)
  const [rowIdToIndex, setRowIdToIndex] = useState<Map<string, number>>(new Map());
  const scrollToRow = (rowId: string) => {  
    const index = rowIdToIndex.get(rowId);
    if (scrollRef.current && index !== undefined) {
      scrollRef.current.scrollTo({ top: index * 32, behavior: 'instant' });
    }
  };

  if (isLoading) return <BaseLoadingPage/>
  if (isError || !base) return <div>Error loading base data.</div>

  return (
    <div className="flex flex-col h-dvh">
      <Header 
      sideBarOpen={sideBarOpen} 
      setSideBarOpen={setSideBarOpen}
      searchBarOpen={searchBarOpen}
      setSearchBarOpen={setSearchBarOpen}
      searchValue={searchValue}
      setSearchValue={setSearchValue}
      matchingCells={matchingCells}
      matchingColumns={matchingColumns}
      isMatchingLoading={isMatchingLoading}
      scrollToRow={scrollToRow}
      />
      <div className="flex flex-1 overflow-hidden">
        <ViewSideBar sideBarOpen={sideBarOpen}/>
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            <DataTable 
              tableId={tableId!} 
              matchingCells={matchingCells} 
              matchingColumns={matchingColumns} 
              setRowIdToIndex={setRowIdToIndex}
              scrollRef={scrollRef}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasePage

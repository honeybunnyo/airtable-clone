'use client';

import React  from 'react'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { api } from '~/trpc/react'
import TopBar from './TopBar';
import CreateTableButton from './CreateTableButton';
import TableContextMenu from './TableContextMenu';
import ViewBar from './ViewBar';
import VerticalSeparator from '../../Ui/VerticalSeparator';
import type { PageProps } from '~/app/types/props';

const Page = ({
  sideBarOpen,
  setSideBarOpen,
  searchBarOpen,
  setSearchBarOpen,
  searchValue, 
  setSearchValue, 
  matchingCells,
  isMatchingLoading,
  matchingColumns,
}: PageProps) => {
  const params = useParams()

  const baseId = typeof params?.baseId === 'string' ? params.baseId : undefined
  const tableId = typeof params?.tableId === 'string' ? params.tableId : undefined

  const { data: base, isLoading } = api.base.getBaseById.useQuery(
    { id: baseId! },
    { enabled: !!baseId }
  )

  if (!baseId || typeof baseId !== 'string') return null;
  if (isLoading) return <div>Loading Header...</div>

  const openExtensionOptions = () => { console.log('Opening Extension options') }
  const openToolsOptions = () => { console.log('Opening Tools options') }

  return (
    <div className="text-white">
      <TopBar/>
      {/* Bottom */}
      <div className="flex items-center justify-between flex-auto bg-greentheme h-[32px] gap-2 text-sm font-light">
        {/* First panel */}
        <div className="flex flex-row items-center bg-greentheme-dark h-full w-full rounded-tr-sm content-center pl-3">
            {base && base.tables.map((table) => (
              <TableContextMenu key={`context-menu-${baseId}-${table.id}`} tableId={table.id}>
                <Link key={`${baseId}-${table.id}`} href={`/base/${baseId}/${table.id}`}>
                  <div key={table.id} className={`w-full text-left px-4 py-2 h-full text-sm rounded-t-xs text-overflow ${
                    table.id === tableId ? "font-semibold bg-white text-black" : "font-light text-white"
                  }`}>{table.name}</div>
                </Link>
              </TableContextMenu>
            ))}
            <div className="flex flex-row justify-center items-center text-gray-300 gap-2">
              <VerticalSeparator/>
              <button className="cursor-pointer">
                <ChevronDown className="w-4 h-4"/>
              </button>
              <VerticalSeparator/>
            </div>
          <CreateTableButton baseId={baseId} />
        </div>
        {/* Second panel */}
        <div className="flex flex-row bg-greentheme-dark h-full rounded-tl-sm">
          <button onClick={openExtensionOptions} className="px-3 content-center">
            Extensions
          </button>
          <button onClick={openToolsOptions} className="flex flex-row px-3 items-center gap-1">
            Tools
            <ChevronDown className="w-4 h-4" strokeWidth={1}/>
          </button>
        </div>
      </div>
      <ViewBar
        sideBarOpen={sideBarOpen} 
        setSideBarOpen={setSideBarOpen}
        searchBarOpen={searchBarOpen}
        setSearchBarOpen={setSearchBarOpen}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        matchingCells={matchingCells}
        isMatchingLoading={isMatchingLoading}
        matchingColumns={matchingColumns}
      />
    </div>
  )
}

export default Page
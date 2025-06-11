import React from 'react'
import { api } from '~/trpc/react';
import AddColumnDialog from './AddColumnDialog';
import { ChevronDown, Plus } from 'lucide-react';
import ColumnContextMenu from './ColumnContextMenu';
import DataTableCell from './DataTableCell';
import { useVirtualizer } from '@tanstack/react-virtual';
import LoadingSpinner from '../Header/LoadingSpinner';
import Image from 'next/image';

type DataTableProps = { tableId: string }

const DataTable = ({ tableId }: DataTableProps ) => {
  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = api.table.getPaginatedRows.useInfiniteQuery(
    {
      tableId,
      limit: 200,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  )
  
  const allRows = data ? data.pages.flatMap((d) => d.rows) : []

  const parentRef = React.useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 30,
    overscan: 5,
  })

  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse()

    if (!lastItem) {
      return
    }

    if (
      lastItem.index >= allRows.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      void fetchNextPage()
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allRows.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ])
  
  const utils = api.useUtils()
  const addRow = api.table.addRow.useMutation({
    onSuccess: async () => {
      await utils.table.getTableById.invalidate({ tableId })
    }
  })
  
  const handleAddRow = () => {
    addRow.mutate({
      tableId,
    })
  }

  const { data: columns, isLoading: isColumnsLoading } = api.table.getTableColumns.useQuery({ tableId })
  if (isColumnsLoading || !columns) {
    return <div className="p-4 text-gray-500">Loading table...</div>
  }
  const length = columns.length

  return (
    <div>
      <div ref={parentRef} className="overflow-auto relative h-full w-full flex flex-row">
        <table className='max-h-full overflow-auto w-auto table-auto'>
          <thead>
            <tr className='h-[32px]'>
              <th className='w-[32px] border border-gray-200 font-light bg-[#f4f4f4] text-sm'>
                <input type="checkbox" value="" className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded-sm"/>
              </th>
              {columns?.map(col => (
                <th key={`col-${col.id}`} className='border border-gray-200 w-[180px] font-light bg-[#f4f4f4] text-sm'>
                    <ColumnContextMenu columnId={col.id}>
                      <div className='flex flex-row justify-between items-center px-2 cursor-context-menu'>
                        <div className='flex flex-row'>
                          {
                            col.type == 'NUMBER' ?
                            <Image
                              src="/straight-hash.svg"
                              alt="Number icon"
                              width={18}
                              height={18}
                              className="mr-1"
                            />
                            :
                            <p className='px-2 font-light text-gray-600'>A</p>
                          }
                          {col.name}
                        </div>
                        <ChevronDown className='w-4 h-4 text-gray-400 hover:text-gray-600' />
                      </div>
                    </ColumnContextMenu>
                  </th>
              ))}
            </tr>
          </thead>
       <tbody>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const isLoaderRow = virtualRow.index > allRows.length - 1
          const rowData = allRows[virtualRow.index]
          return (
            <tr
              key={virtualRow.index}
              className="h-[40px]"
            >
              <td className="w-[32px] border-y border-gray-200 font-light text-sm">
                <div className="flex items-center justify-center h-full">
                  {virtualRow.index + 1}
                </div>
              </td>
              {isLoaderRow ? (
                <td colSpan={columns?.length ?? 1} className="border-y border-r border-gray-200 px-2">
                {hasNextPage && allRows.length > 0 ? <LoadingSpinner/> : null}
                </td>
              ) : (
                rowData && rowData.cells.map((cell) => (
                  <td key={cell.id} className="border-y border-r border-gray-200 px-2">
                    <DataTableCell
                      initialValue={cell.value == null ? ' ' :
                        typeof cell.value === 'object' ? JSON.stringify(cell.value) : String(cell.value)}
                      cellId={cell.id}
                      columnType={cell.column.type ?? 'TEXT'}
                    />
                  </td>
                ))
              )}
            </tr>
          )
        })}
      </tbody>
          <tfoot>
            <tr
              className="h-[32px] cursor-pointer hover:bg-gray-100"
              onClick={handleAddRow}
            >
              <td colSpan={length} className="border border-gray-200 text-left text-gray-400 text-xl px-2">
                <Plus/>
              </td>
            </tr>
          </tfoot>
        </table>
        <AddColumnDialog tableId={tableId}/>
      </div>
    </div>
  )
}

export default DataTable
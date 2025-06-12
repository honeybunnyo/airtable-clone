/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect } from 'react'
import { api } from '~/trpc/react';
import AddColumnDialog from './AddColumnDialog';
import { Plus } from 'lucide-react';
import DataTableCell from './DataTableCell';
import LoadingSpinner from '../Header/LoadingSpinner';
import { useInView } from 'react-intersection-observer';
import DataTableHeader from './DataTableHeader';

type DataTableProps = { tableId: string }

const DataTable = ({ tableId }: DataTableProps ) => {
 const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage
  } = api.table.getPaginatedRows.useInfiniteQuery(
    {
      tableId,
      limit: 30,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage]);

  const utils = api.useUtils()
  const addRow = api.table.addRow.useMutation({
    onSuccess: async () => {
      await utils.table.getPaginatedRows.invalidate({ tableId })
    }
  })

  const handleAddRow = () => addRow.mutate({ tableId })
  const { data: columns, isLoading: isColumnsLoading } = api.table.getTableColumns.useQuery({ tableId })

  if (isColumnsLoading || !columns) {
    return <div className="p-4 text-gray-500">Loading table columns...</div>
  }

  if (!data) return <div>Loading Table data...</div>;

  const allRows = data.pages.flatMap((page, pageIndex) => 
    page.rows.map((row, rowIndex) => ({
      ...row,
      globalIndex: data.pages
        .slice(0, pageIndex)
        .reduce((acc, prevPage) => acc + prevPage.rows.length, 0) + rowIndex + 1
    }))
  );

  return  (
    <div className="flex flex-row w-auto">
      <table className="table-auto border-collapse">
        <DataTableHeader columns={columns}/>
        {/* Table content */}
        <tbody>
          {allRows.map((row) => (
            <tr key={row.id} className="h-[32px]">
              {/* row number cell */}
              <td className="w-[50px] border border-gray-200 font-light text-sm">
                <div className="flex items-center justify-center h-full">
                  {row.globalIndex}
                </div>
              </td>
              {/* rest of cells */}
              {row.cells.map((cell) => (
                <td key={cell.id} className="border border-gray-200 w-[180px]">
                  <DataTableCell
                    initialValue={cell.value == null ? ' ' :
                      typeof cell.value === 'object' ? JSON.stringify(cell.value) : String(cell.value)}
                    cellId={cell.id}
                    columnType={cell.column.type ?? 'TEXT'}
                  />
                </td>
              ))}
            </tr>
          ))}
          <tr className="h-[32px] w-full cursor-pointer hover:bg-gray-100 border border-gray-200" onClick={handleAddRow}>
            <td colSpan={columns.length + 1} className="text-left text-gray-400 text-xl px-2">
              <Plus/>
            </td>
          </tr>
          <tr ref={ref}>
            <td colSpan={columns.length + 1} className="text-center p-2">
              {isFetchingNextPage && <LoadingSpinner/>}
            </td>
          </tr>
        </tbody>
      </table>
      <AddColumnDialog tableId={tableId}/>
    </div>
  )
}

export default DataTable

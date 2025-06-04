import React, { useMemo } from 'react'
import type { Row } from '~/app/types/schema';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { api } from '~/trpc/react';
import AddColumnDialog from './AddColumnDialog';
import { ChevronDown } from 'lucide-react';
import ColumnContextMenu from './ColumnContextMenu';
import DataTableCell from './DataTableCell';

type DataTableProps = { tableId: string }

const DataTable = ({ tableId }: DataTableProps ) => {
  const { data, isLoading } = api.table.getTableById.useQuery({ id: tableId })
  const columns = useMemo<ColumnDef<Row>[]>(() => {
    return (data?.columns ?? []).map((col, index) => ({
      accessorFn: (row: Row) => row.data?.[col.name] ?? '',
      id: `${col.name}-${index}`,
      header: () => col.name,
      cell: info => info.getValue(),
    }))
  }, [data?.columns]);

  const paddedRows = useMemo(() => {
    const baseRows = (data?.rows as Row[]) ?? [];
    const result = [...baseRows];
    while (result.length < 3) {
      result.push({
        id: `empty-${result.length}`,
        tableId,
        data: {},
      });
    }
    return result;
  }, [data?.rows, tableId]);

  const table = useReactTable<Row>({
    data: paddedRows,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  });  
  
  const handleAddRow = () => {
    console.log('add row')
  }

  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>No data found</div>

  return (
    <>
      <div className='flex flex-row'>
      <table className='border border-gray-200'>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className='h-[32px]'>
              {headerGroup.headers.map(header => (
                <th key={`${headerGroup.id}-${header.id}`} className='border border-gray-200 w-[180px] font-light bg-[#f4f4f4] text-sm'>
                  <ColumnContextMenu columnId={header.column.id}>
                    <div className='flex flex-row justify-between items-center px-2 cursor-context-menu'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      <ChevronDown className='w-4 h-4 text-gray-400 hover:text-gray-600' />
                    </div>
                  </ColumnContextMenu>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className='h-[32px]'>
              {row.getVisibleCells().map(cell => (
                <td key={`${row.id}-${cell.column.id}`} className='border border-gray-200 p-0'>
                  <DataTableCell
                    initialValue={String(cell.getValue()) ?? ' '}
                    rowId={row.original.id}
                    columnKey={cell.column.id}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr
            className="h-[32px] cursor-pointer hover:bg-gray-100"
            onClick={handleAddRow}
          >
            <td colSpan={columns.length} className="text-left text-gray-400 text-xl px-2">
              +
            </td>
          </tr>
        </tfoot>
      </table>
      <AddColumnDialog tableId={tableId}/>
      </div>
    </>
  )
}

export default DataTable
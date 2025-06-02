import React, { useMemo } from 'react'
import type { Column, Row, Table } from '~/app/types/schema';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { api } from '~/trpc/react';

type DataTableProps = { tableId: string }

const DataTable = ({ tableId }: DataTableProps ) => {
  const { data, isLoading } = api.table.getTableById.useQuery({ id: tableId })
  const columns = useMemo<ColumnDef<Row>[]>(() => {
  return (data?.columns ?? []).map(col => ({
    accessorFn: (row: Row) => row.data?.[col.name] ?? '',
    id: col.name,
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

  const handleAddColumn = () => {
    console.log('add col')
  }

  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>No data found</div>

  const updateCell = (rowId: string, columnKey: string, value: string) => {
    console.log('Update cell!')
  }
  return (
     <>
      <div className='flex flex-row'>
      <table className='border border-gray-200'>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className='h-[32px]'>
              {headerGroup.headers.map(header => (
                <th key={header.id} className='border border-gray-200 w-[180px] font-light bg-[#f4f4f4] text-sm'>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className='h-[32px]'>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className='border border-gray-200 p-0'>
                    <input
                      type="text"
                      value={String(cell.getValue()) ?? ''}
                      onChange={(e) => {
                        const newValue = e.target.value
                        const rowId = row.original.id
                        const columnKey = cell.column.id
                        updateCell(rowId, columnKey, newValue)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Tab') {
                          e.preventDefault()
                          const current = e.currentTarget as HTMLInputElement
                          const inputs = Array.from(document.querySelectorAll('td input')).filter(
                            (e): e is HTMLInputElement => e instanceof HTMLInputElement
                          );
                          const index = inputs.indexOf(current)
                          const next = e.shiftKey ? inputs[index - 1] : inputs[index + 1]
                          next?.focus()
                        }
                      }}
                      className="w-full h-full bg-transparent focus:outline-blue-500 p-1"
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
      <button
        onClick={handleAddColumn}
        className="h-[32px] w-30 text-gray-600 border border-gray-200 bg-gray-100 hover:bg-gray-200 text-lg"
      >
        ＋
      </button>
      </div>
  
    </>
  )
}

export default DataTable
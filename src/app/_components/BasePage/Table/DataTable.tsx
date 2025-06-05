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
    return (data?.columns ?? []).map(col => ({
      accessorFn: (row: Row) => {
        return row.data[col.name] ?? { value: '', cellId: '' };
      },
      id: col.id,
      header: () => col.name,
      cell: info => {
        const cellValue = info.getValue() as { value: string | number; cellId: string };
        return (
          <DataTableCell
            initialValue={String(cellValue.value)}
            cellId={cellValue.cellId}
            columnType={col.type}
          />
        );
      }
    }));
  }, [data?.columns]);

  const tableData: Row[] = useMemo(() => {
    if (!data?.rows || !data.columns) return [];

    return data.rows.map(row => {
      const cellMap: Record<string, { value: string | number; cellId: string }> = {};

      for (const cell of row.cells) {
        const col = data.columns.find(col => col.id === cell.columnId);
        if (col) {
          cellMap[col.name] = {
          value: typeof cell.value === 'string' || typeof cell.value === 'number'
            ? cell.value
            : '',
          cellId: cell.id,
        };
        }
      }

      const normalizedCells = row.cells
        .filter(c => typeof c.value === 'string' || typeof c.value === 'number')
        .map(c => ({
          id: c.id,
          rowId: c.rowId,
          columnId: c.columnId,
          value: c.value as string | number,
        }));
      return {
        id: row.id,
        tableId: row.tableId,
        order: row.order,
        data: cellMap,
        cells: normalizedCells
      };
    });
  }, [data?.rows, data?.columns]);

  const table = useReactTable<Row>({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true, 
  });

  const utils = api.useUtils()
  const addRow = api.table.addRow.useMutation({
    onSuccess: async () => {
      await utils.table.getTableById.invalidate({ id: tableId })
    }
  })
  
  const handleAddRow = () => {
    addRow.mutate({
      tableId,
    })
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
              {row.getVisibleCells().map(cell => {
                const cellData = cell.getValue() as { value: string | number; cellId: string };
                const columnDef = data?.columns?.find(col => col.id === cell.column.id);
                return (
                  <td key={`${row.id}-${cell.column.id}`} className='border border-gray-200 p-0'>
                    <DataTableCell
                      initialValue={String(cellData.value) ?? ' '}
                      cellId={cellData.cellId}
                      columnType={columnDef?.type ?? 'TEXT'} 
                    />
                  </td>
                );
              })}
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
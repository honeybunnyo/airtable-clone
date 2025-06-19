import React, { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '~/trpc/react';
import AddColumnDialog from './AddColumnDialog';
import DataTableCell from './DataTableCell';
import LoadingSpinner from '../../Common/LoadingSpinner';
import DataTableHeader from './DataTableHeader';
import TableSkeleton from '../Skeletons/TableSkeleton';
import type { DataTableProps } from '~/app/types/props';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useGlobalSaving } from '~/lib/stores/useGlobalSaving';

const DataTable = ({ tableId, matchingCells, matchingColumns }: DataTableProps ) => {
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage
  } = api.table.getPaginatedRows.useInfiniteQuery(
    {
      tableId,
      limit: 1000,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
  const scrollRef = useRef<HTMLDivElement>(null);
    const [colToDelete, setColDelete] = useState("");
  
  const { data: columns, isLoading: isColumnsLoading } = api.table.getTableColumns.useQuery({ tableId })
  const columnTypeMap = useMemo(() => {
    const map: Record<string, string> = {};
    columns?.forEach((col) => {
      map[col.id] = col.type ?? 'TEXT';
    });
    return map;
  }, [columns]);


  const allRows = data && columns && !isColumnsLoading
    ? data.pages.flatMap((page, pageIndex) => 
        page.rows.map((row, rowIndex) => ({
          ...row,
          globalIndex: data.pages
            .slice(0, pageIndex)
            .reduce((acc, prevPage) => acc + prevPage.rows.length, 0) + rowIndex + 1
        }))
      )
    : [];

  const virtualizer = useVirtualizer({
    count: allRows.length,
    estimateSize: () => 36,
    getScrollElement: () => scrollRef.current,
    overscan: 10,
  });

  // Fetch second page after first page
  useEffect(() => {
    if (data?.pages.length === 1 && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.pages.length, hasNextPage, isFetchingNextPage]);

  
  useEffect(() => {
    const lastItem = virtualizer.getVirtualItems().at(-1);
    if (!lastItem) return;
    if (lastItem.index >= allRows.length - 1 - 2800 && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [virtualizer.getVirtualItems(), hasNextPage, isFetchingNextPage, fetchNextPage, allRows.length]);

  // Warn user on there may be unsaved changes
  const { isSaving } = useGlobalSaving();
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isSaving) {
        e.preventDefault();
        e.returnValue = 'Changes you made may not be saved.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSaving]);

  if (!isColumnsLoading || !columns || !data) {
    return <TableSkeleton/>
  }

  const virtualItems = virtualizer.getVirtualItems()
  return  (
    <div ref={scrollRef} className="h-full overflow-auto w-full flex flex-row">
      <table className="border-collapse table-fixed">
        <DataTableHeader columns={columns} matchingColumns={matchingColumns} colToDelete={colToDelete} setColDelete={setColDelete}/>

        <tbody style={{ position: 'relative', display: 'block', height: `${virtualizer.getTotalSize()}px` }}>
          {virtualItems.map((vItem) => {
            const row = allRows[vItem.index];
            if (!row) return null;
            return (
              <tr
                key={`row-${row.id}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${vItem.start}px)`
                }}
                className="flex w-full"
              >
              {/* row number cell */}
                <td className="min-w-[50px] border-b border-r border-gray-200 font-light text-sm">
                  <div className="flex items-center justify-center h-full">
                    {row.globalIndex}
                  </div>
                </td>
                {columns.map((col) => {
                  const cell = row.cells?.find((c) => c.columnId === col.id) ?? {
                    value: '',
                    id: `${row.id}-${col.id}`,
                    columnId: col.id,
                  };
                  if (colToDelete === col.id) {
                    return null
                  }
                  return (
                    <td
                      key={col.id}
                      className="border-r border-b border-gray-200 px-2 py-1 truncate w-[180px]"
                      style={{ minWidth: 180 }}
                    >
                      <DataTableCell
                        matchingCells={matchingCells}
                        initialValue={
                          cell.value == null
                            ? ' '
                            : typeof cell.value === 'object'
                            ? JSON.stringify(cell.value)
                            : String(cell.value)
                        }
                        cellId={`${row.id}-${col.id}`}
                        columnType={columnTypeMap[cell.columnId] as 'TEXT' | 'NUMBER' ?? 'TEXT'}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {/* Loading spinner for next page */}
          {isFetchingNextPage && (
            <tr
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualizer.getTotalSize()}px)`,
              }}
              className="flex w-full"
            >
              <td colSpan={columns.length + 1} className="text-center p-2 text-sm text-gray-500">
                <LoadingSpinner />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <AddColumnDialog tableId={tableId}/>
    </div>
  )
}

export default DataTable

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { api } from '~/trpc/react';
import AddColumnDialog from './AddColumnDialog';
import DataTableCell from './DataTableCell';
import LoadingSpinner from '../../Common/LoadingSpinner';
import { useInView } from 'react-intersection-observer';
import DataTableHeader from './DataTableHeader';
import TableSkeleton from '../Skeletons/TableSkeleton';
import AddRowButton from './AddRowButton';
import type { DataTableProps } from '~/app/types/props';

const findScrollParent = (element: HTMLElement): HTMLElement => {
  if (!element) return document.documentElement;
  const { overflow, overflowY } = window.getComputedStyle(element);
  if (overflow === 'auto' || overflow === 'scroll' || overflowY === 'auto' || overflowY === 'scroll') {
    return element;
  }
  
  return findScrollParent(element.parentElement!);
};

const DataTable = ({ tableId, matchingCells, matchingColumns }: DataTableProps ) => {
 const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage
  } = api.table.getPaginatedRows.useInfiniteQuery(
    {
      tableId,
      limit: 250,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
  const [colToDelete, setColDelete] = useState("");

  const { ref } = useInView({
    threshold: 0.1,
    rootMargin: '200px',
  });

  const tableRef = useRef<HTMLTableElement>(null);

  const checkScrollPosition = useCallback(() => {
    if (!tableRef.current) return;
    
    const scrollParent = findScrollParent(tableRef.current);
    const scrollTop = scrollParent.scrollTop;
    const containerHeight = scrollParent.clientHeight;
    const scrollHeight = scrollParent.scrollHeight;
    const scrollPercentage = (scrollTop + containerHeight) / scrollHeight;
    
    if (scrollPercentage > 0.4 && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Set up scroll tracking
  useEffect(() => {
    if (!tableRef.current) return;
    const scrollParent = findScrollParent(tableRef.current);
    scrollParent.addEventListener('scroll', checkScrollPosition);
    
    return () => scrollParent.removeEventListener('scroll', checkScrollPosition);
  }, [checkScrollPosition]);

  const { data: columns, isLoading: isColumnsLoading } = api.table.getTableColumns.useQuery({ tableId })
  const columnTypeMap = useMemo(() => {
    const map: Record<string, string> = {};
    columns?.forEach((col) => {
      map[col.id] = col.type ?? 'TEXT';
    });
    return map;
  }, [columns]);

  if (isColumnsLoading || !columns || !data) {
    return <TableSkeleton/>
  }

  const allRows = data.pages.flatMap((page, pageIndex) => 
    page.rows.map((row, rowIndex) => ({
      ...row,
      globalIndex: data.pages
        .slice(0, pageIndex)
        .reduce((acc, prevPage) => acc + prevPage.rows.length, 0) + rowIndex + 1
    }))
  );
  // Calculate halfway point of the current page instead of all rows
  const currentPageRows = data.pages[data.pages.length - 1]?.rows.length ?? 0;
  const halfwayIndex = allRows.length - Math.floor(currentPageRows / 2);

  return  (
    <div className="flex flex-row w-auto">
      <table ref={tableRef} className="table-auto border-collapse">
        <DataTableHeader columns={columns} matchingColumns={matchingColumns} colToDelete={colToDelete} setColDelete={setColDelete}/>
        {/* Table content */}
        <tbody>
          {allRows.map((row, index) => (
            <React.Fragment key={row.id}>
              <tr className="h-[32px]">
                {/* row number cell */}
                <td className="w-[50px] border border-gray-200 font-light text-sm">
                  <div className="flex items-center justify-center h-full">
                    {row.globalIndex}
                  </div>
                </td>
                {/* rest of cells */}
                {row.cells.map((cell) => {
                  if (cell.columnId == colToDelete) return
                
                  return(
                    <td key={cell.id} className="border border-gray-200 w-[180px]">
                      <DataTableCell
                        matchingCells={matchingCells}
                        initialValue={cell.value == null ? ' ' :
                          typeof cell.value === 'object' ? JSON.stringify(cell.value) : String(cell.value)}
                        cellId={cell.id}
                        columnType={columnTypeMap[cell.columnId] as 'TEXT' | 'NUMBER' ?? 'TEXT'}
                      />
                    </td>
                  )
                })}
              </tr>
              {/* Invisible trigger row at halfway point */}
              {index === halfwayIndex && (
                <tr ref={ref} className="h-0">
                  <td colSpan={columns.length + 1} className="h-0 p-0 border-0"></td>
                </tr>
              )}
            </React.Fragment>
          ))}
          <AddRowButton length={columns.length + 1} tableId={tableId}/>
          <tr>
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

'use client'
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { fetchItems } from '../api/items';
import { api } from '~/trpc/react';
import DataTableCell from '../_components/BasePage/Table/DataTableCell';
import LoadingSpinner from '../_components/BasePage/Header/LoadingSpinner';

export default function App() {
 const { 
    data, 
    error, 
    status, 
    fetchNextPage, 
    isFetchingNextPage,
    hasNextPage 
  } = api.table.getPaginatedRows.useInfiniteQuery(
    {
      tableId: 'cmbq174b003yuv6jcz6gbypg9',
      limit: 30,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView, hasNextPage]);


  return status === 'pending' ? (
    <div>Loading...</div>
  ) : status === 'error' ? (
    <div>{error.message}</div>
  ) : (
    <div className="flex flex-col">
      {/* Table Header */}


      
      {/* Table content */}
      {data.pages.map((page, pageIndex) => (
        <div key={pageIndex} className="flex flex-col">
          {page.rows.map((row) => (
            <div key={row.id} className="flex flex-row">
              {row.cells.map((cell) => (
                <div key={cell.id} className="border-y border-r border-gray-200 px-2">
                  <DataTableCell
                    initialValue={cell.value == null ? ' ' :
                      typeof cell.value === 'object' ? JSON.stringify(cell.value) : String(cell.value)}
                    cellId={cell.id}
                    columnType={cell.column.type ?? 'TEXT'}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
      <div ref={ref}>{isFetchingNextPage && <LoadingSpinner/>}</div>
    </div>
  );
}
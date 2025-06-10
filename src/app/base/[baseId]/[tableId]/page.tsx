"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '~/trpc/react';
import Header from '../../../_components/BasePage/Header';
import DataTable from '../../../_components/BasePage/Table/DataTable';
import ViewSideBar from '~/app/_components/BasePage/ViewSidebar';

const BasePage = () => {
  const { baseId, tableId } = useParams();
  const [ sideBarOpen, setSideBarOpen ] = useState(false);
  const { data: base, isLoading, isError } = api.base.getBaseById.useQuery(
    { id: baseId as string },
    { enabled: !!baseId }
  )

  if (isLoading) return <div>Loading...</div>
  if (isError || !base) return <div>Error loading base data.</div>

  return (
    <div className='flex flex-col h-dvh'>
      <Header sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />

     <div className="flex flex-1 overflow-hidden">
      {sideBarOpen && <ViewSideBar sideBarOpen={sideBarOpen} />}

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <DataTable tableId={tableId as string} />
        </div>
      </div>
    </div>
    </div>
  )
}

export default BasePage

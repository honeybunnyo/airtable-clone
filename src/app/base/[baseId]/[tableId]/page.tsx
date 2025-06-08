"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { api } from '~/trpc/react';
import Header from '../../../_components/BasePage/Header';
import DataTable from '../../../_components/BasePage/Table/DataTable';
import ViewSideBar from '~/app/_components/BasePage/ViewSidebar';

const BasePage = () => {
  const { baseId, tableId } = useParams()
  const { data: base, isLoading, isError } = api.base.getBaseById.useQuery(
    { id: baseId as string },
    { enabled: !!baseId }
  )

  if (isLoading) return <div>Loading...</div>
  if (isError || !base) return <div>Error loading base data.</div>

  return (
    <div className='flex flex-col h-dvh'>
      <Header/>
      <div className='flex flex-row flex-1 overflow-hidden'>
        <ViewSideBar/>
        { base && <>
          <DataTable tableId={tableId as string}/>
        </>
        }
      </div>
    </div>
  )
}

export default BasePage

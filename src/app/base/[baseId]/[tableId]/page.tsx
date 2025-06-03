"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { api } from '~/trpc/react';
import TopBar from '../../../_components/BasePage/Header/TopBar';
import DataTable from '../../../_components/BasePage/DataTable';

const BasePage = () => {
  const { baseId, tableId } = useParams()
  const { data: base, isLoading, isError } = api.base.getBaseById.useQuery(
    { id: baseId as string },
    { enabled: !!baseId }
  )

  if (isLoading) return <div>Loading...</div>
  if (isError || !base) return <div>Error loading base data.</div>

  return (
    <div>
      <TopBar/>
      { base && <>
        <DataTable tableId={tableId as string}/>
      </>
      }
    </div>
  )
}

export default BasePage

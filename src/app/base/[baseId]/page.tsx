"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { api } from '~/trpc/react';
import TopBar from '../../_components/BasePage/Header/TopBar';

const BasePage = () => {
  const { baseId } = useParams()
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
        <h1 className="text-xl font-bold">NO TABLES for {base.name}!</h1>
        <p>Base ID: {base.id}</p>
        <p>Owner: {base.user.name}</p>
      </>
      }
    </div>
  )
}

export default BasePage

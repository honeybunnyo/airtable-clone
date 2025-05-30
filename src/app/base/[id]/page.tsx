"use client"

import React from 'react'
import { useParams } from 'next/navigation'
import { api } from '~/trpc/react';

const BasePage = () => {
  const { id } = useParams()
  const { data: base, isLoading, isError } = api.base.getBaseById.useQuery(
    { id: id as string },
    { enabled: !!id }
  )

  if (isLoading) return <div>Loading...</div>
  if (isError || !base) return <div>Error loading base data.</div>

  return (
    <div className="p-4">
      { base && <>
        <h1 className="text-xl font-bold">Welcome to {base.name}!</h1>
        <p>Base ID: {base.id}</p>
        <p>Owner: {base.user.name}</p>
      </>
      }
     
    </div>
  )
}

export default BasePage

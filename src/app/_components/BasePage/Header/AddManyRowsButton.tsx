'use client'

import React from 'react'
import { Button } from '~/components/ui/button'
import { api } from '~/trpc/react'
import { faker } from '@faker-js/faker'
import { useParams } from 'next/navigation';

const AddManyRowsButton = () => {
  const params = useParams()
  const tableId = typeof params?.tableId === 'string' ? params.tableId : undefined
  const utils = api.useUtils()
  const addManyRows = api.table.addManyRows.useMutation({
    onSuccess: async () => {
      await utils.table.getPaginatedRows.invalidate({ tableId })
    }
  })

  if (!tableId) return
  
  const handleImportRows = () => {
    const rows = Array.from({ length: 100 }, () => ({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
      }
    }))
    addManyRows.mutate({
      tableId,
      rows,
    })
  }

  return (
    <Button variant="ghost" className="w-30" onClick={handleImportRows}>
      add 100 rows
    </Button>
  )
}

export default AddManyRowsButton
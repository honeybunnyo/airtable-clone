'use client'

import React from 'react'
import { Button } from '~/components/ui/button'
import { api } from '~/trpc/react'
import { faker } from '@faker-js/faker'
import { useParams } from 'next/navigation';
import { withGlobalSaving } from '~/lib/utils';

const Add100kRowsButton = () => {
  const params = useParams()
  const tableId = typeof params?.tableId === 'string' ? params.tableId : undefined
  const utils = api.useUtils()
  const addManyRows = api.table.addManyRows.useMutation({
    onSuccess: async () => {
      await utils.table.getPaginatedRows.invalidate({ tableId })
    }
  })

  if (!tableId) return
  
  const handleImportRows = async () => {
    const total = 100000
    const batchSize = 5000
    const numBatches = total / batchSize

    for (let i = 0; i < numBatches; i++) {
      const rows = Array.from({ length: batchSize }, () => ({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        }
      }))
      
    await withGlobalSaving(() => addManyRows.mutateAsync({
        tableId,
        rows,
      })
    )

      console.log(`Batch ${i + 1} of ${numBatches} done`)
    }
    await utils.table.getPaginatedRows.invalidate({ tableId })
  }

  return (
    <Button variant="ghost" className="w-24" onClick={handleImportRows}>
      + 100k rows
    </Button>
  )
}

export default Add100kRowsButton
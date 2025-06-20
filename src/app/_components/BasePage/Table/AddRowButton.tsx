import React from 'react'
import { Button } from '~/components/ui/button'
import { api } from '~/trpc/react'


type AddRowButtonProps = { 
  tableId: string, 
}

const AddRowButton = ({ tableId }: AddRowButtonProps) => {
  const utils = api.useUtils()

  const addRow = api.table.addRow.useMutation({
    onSuccess: async () => {
      await utils.table.getPaginatedRows.invalidate({ tableId })
    }
  })

  const handleAddRow = () => addRow.mutate({ tableId })

  return (
    <Button variant="ghost" className="w-24" onClick={handleAddRow}>
      + Add row
    </Button>
  )
}

export default AddRowButton
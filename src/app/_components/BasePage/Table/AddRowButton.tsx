import { Plus } from 'lucide-react'
import React from 'react'
import { api } from '~/trpc/react'


type AddRowButtonProps = { 
  tableId: string, 
  length: number 
}

const AddRowButton = ({ tableId, length}: AddRowButtonProps) => {
  const utils = api.useUtils()

  const addRow = api.table.addRow.useMutation({
    onSuccess: async () => {
      await utils.table.getPaginatedRows.invalidate({ tableId })
    }
  })

  const handleAddRow = () => addRow.mutate({ tableId })

  return (
    <tr className="h-[32px] w-full cursor-pointer hover:bg-gray-100 border border-gray-200" onClick={handleAddRow}>
      <td colSpan={length} className="text-left text-gray-400 text-xl px-2">
        <Plus/>
      </td>
    </tr>
  )
}

export default AddRowButton
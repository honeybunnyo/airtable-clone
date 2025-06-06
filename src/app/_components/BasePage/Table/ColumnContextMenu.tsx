import React from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../../../../components/ui/context-menu"
import { api } from '~/trpc/react'
import { useParams } from 'next/navigation'

type ColumnContextMenuProps = {
  children: React.ReactNode
  columnId: string
}

const ColumnContextMenu: React.FC<ColumnContextMenuProps> = ({ children, columnId }) => {
  const utils = api.useUtils()
  const params = useParams()
  const tableId = typeof params?.tableId === 'string' ? params.tableId : undefined

  const deleteTable = api.column.delete.useMutation({
    onSuccess: async () => {
      await utils.table.getTableById.invalidate({ id: tableId })
    }
  })
  
  const handleDelete = () => {
    deleteTable.mutate({ columnId })
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem inset>
          Filter by this field
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset>
          Sort A-Z
        </ContextMenuItem>
        <ContextMenuItem inset>
          Sort Z-A
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset>
          Hide field
        </ContextMenuItem>
        <ContextMenuItem inset className="text-red-500" onClick={handleDelete}>
          Delete field
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default ColumnContextMenu
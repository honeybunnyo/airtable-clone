'use client';

import React from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/components/ui/context-menu"
import { api } from '~/trpc/react'
import { useParams } from 'next/navigation'

type TableContextMenuProps = {
  children: React.ReactNode
  tableId: string
}

const TableContextMenu: React.FC<TableContextMenuProps> = ({ children, tableId }) => {
  const utils = api.useUtils()
  const params = useParams()
  const baseId = typeof params?.baseId === 'string' ? params.baseId : undefined

  const deleteTable = api.table.delete.useMutation({
    onSuccess: async () => {
      await utils.base.getBaseById.invalidate({ id: baseId })
    }
  })
  
  const handleDelete = () => {
    deleteTable.mutate({ id: tableId })
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem inset>
          Rename table
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset>
          Hide table
        </ContextMenuItem>
        <ContextMenuItem inset>
          Duplicate Table
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset className="text-red-500" onClick={handleDelete}>
          Delete table
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default TableContextMenu
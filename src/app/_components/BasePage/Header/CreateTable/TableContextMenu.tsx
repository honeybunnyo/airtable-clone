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
import { toast } from 'sonner';
import Link from 'next/link';
import type { TableContextMenuProps } from '~/app/types/props';

const TableContextMenu: React.FC<TableContextMenuProps> = ({ table, tableId }) => {
  const utils = api.useUtils()
  const params = useParams()
  const baseId = typeof params?.baseId === 'string' ? params.baseId : undefined

  const deleteTable = api.table.delete.useMutation({
    onSuccess: async () => {
      await utils.base.getBaseById.invalidate({ id: baseId })
    }
  })
  
  const handleDelete = async () => {
    toast(`Deleting table ${table.name}...`)
    await deleteTable.mutateAsync({ id: table.id })
    toast(`Successfully deleted table ${table.name}!`)
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Link key={`${baseId}-${table.id}`} href={`/base/${baseId}/${table.id}`}>
          <div key={table.id} className={`w-full text-left px-4 py-2 h-full text-sm rounded-t-xs text-overflow ${
            table.id === tableId ? "font-semibold bg-white text-black" : "font-light text-white"
          }`}>{table.name}</div>
        </Link>
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
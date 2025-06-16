import React from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '~/components/ui/context-menu'
import { api } from '~/trpc/react'
import { useParams } from 'next/navigation'
import { withGlobalSaving } from '~/lib/utils';
import type { ColumnContextMenuProps } from '~/app/types/props';
import { toast } from 'sonner';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

const ColumnContextMenu: React.FC<ColumnContextMenuProps> = ({ column, setColDelete }) => {
  const utils = api.useUtils()
  const params = useParams()
  const tableId = typeof params?.tableId === 'string' ? params.tableId : undefined

  const deleteColumn = api.column.delete.useMutation({
    onSuccess: async () => {
      await utils.table.getPaginatedRows.invalidate({ tableId })
      await utils.table.getTableColumns.invalidate({ tableId })
    }
  })
  
  const handleDelete = async () => {
    setColDelete(column.id)
    toast(`Deleting field ${column.name}...`)
    await withGlobalSaving(() => deleteColumn.mutateAsync({ columnId: column.id }))
    toast(`Successfully deleted field ${column.name}`)
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
         <div className="flex flex-row justify-between items-center px-2 cursor-context-menu w-full">
          <div className="flex flex-row items-center">
            {column.type === 'NUMBER' ? (
              <Image
              src="/straight-hash.svg"
              alt="Number icon"
              width={18}
              height={18}
              className="mr-1"
              />
            ) : (
              <p className="px-2 font-light text-gray-600">A</p>
            )}
            {column.name}
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 hover:text-gray-600" />
        </div>
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
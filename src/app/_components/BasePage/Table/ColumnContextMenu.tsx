import React from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '~/components/ui/context-menu'
import { useParams } from 'next/navigation'
import { withGlobalSaving } from '~/lib/utils';
import type { ColumnContextMenuProps } from '~/app/types/props';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { useTableMutations } from '~/app/hooks/useTableMutations';
import { useCancelledColumns } from '~/lib/stores/cancelledColumnsStore';

const ColumnContextMenu: React.FC<ColumnContextMenuProps> = ({ column, setColDelete }) => {
  const params = useParams()
  const tableId = typeof params?.tableId === 'string' ? params.tableId : ""
  
  const { deleteColumn } = useTableMutations(tableId);
  const { cancelColumn } = useCancelledColumns();
  
  
  const handleDelete = async () => {
    setColDelete(column.id)
    if (column.id.startsWith("temp-")) {
      cancelColumn(column.name);
      return
    }
    await withGlobalSaving(() => deleteColumn.mutateAsync({ columnId: column.id }))
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
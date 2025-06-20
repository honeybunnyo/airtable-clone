import type { View } from '@prisma/client'
import { Check, TableCellsSplit } from 'lucide-react'
import React from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/components/ui/context-menu"
import { useViewMutations } from '~/app/hooks/useViewMutations';

type ViewComponentProps = {
  view: View
  selected: boolean
  onSelect: (id: string) => void
}
const ViewComponent = ({ view, selected, onSelect}: ViewComponentProps) => {
  const { deleteView } = useViewMutations(view.tableId)

  const handleDelete = async () => {
    await deleteView.mutateAsync({ viewId: view.id });
  }  

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          onClick={() => onSelect(view.id)}
          className={`${
            selected ? 'bg-[#d6f2fe]' : 'bg-white hover:bg-gray-100'
          } cursor-pointer w-full h-[32px] py-1 px-2 rounded-xs text-sm font-medium flex flex-row justify-between items-center`}
        >
          <div className="flex flex-row items-center gap-2">
            <TableCellsSplit className="w-4.5 h-4.5 text-blue-800" strokeWidth={1} />
            {view.name}
          </div>
          {selected && <Check className="w-4 h-4 text-blue-800" strokeWidth={1} />}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuItem inset>
          Rename view
        </ContextMenuItem>
        <ContextMenuItem inset>
          Duplicate View
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset className="text-red-500" onClick={handleDelete}>
          Delete View
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default ViewComponent
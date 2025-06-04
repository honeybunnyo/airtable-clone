import React from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "../../../../components/ui/context-menu"

type ColumnContextMenuProps = {
  children: React.ReactNode
  columnId: string
}

const ColumnContextMenu: React.FC<ColumnContextMenuProps> = ({ children, columnId }) => {
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
        <ContextMenuItem inset className="text-red-500">
          Delete field
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default ColumnContextMenu
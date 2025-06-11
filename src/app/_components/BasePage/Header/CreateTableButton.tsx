import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu"
import { BookOpen, Plus, Sparkle, StickyNote } from 'lucide-react';
import { CreateTableDialog } from './CreateTableDialog';

const CreateTableButton = ({ baseId }: { baseId: string } ) => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='px-2 hover:text-gray-50 text-lg flex flex-row justify-center items-center gap-2 cursor-pointer'>
          <Plus className='h-4 w-4 text-gray-300'/> 
          <p className='hidden sm:block text-sm text-white'>
            Add or import
          </p>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-70 mt-2" side="bottom" align="start">
        <p className='px-2 pt-2 text-gray-500 text-xs'>Add a blank table</p>
        <DropdownMenuItem>
          <Sparkle/>
          Create with AI</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setOpen(true)}>
          <StickyNote/>
          Start from scratch
        </DropdownMenuItem>
        <DropdownMenuSeparator/>
        <p className='px-2 pt-2 text-gray-500 text-xs'>Add from other sources</p>
        <DropdownMenuItem>
          <BookOpen/>
          23 more sources...
        </DropdownMenuItem>
      </DropdownMenuContent>
      <CreateTableDialog open={open} setOpen={setOpen} baseId={baseId}/>
    </DropdownMenu>
  )
}

export default CreateTableButton
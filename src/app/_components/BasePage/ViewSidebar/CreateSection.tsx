import React, { useState } from 'react'
import { 
  Calendar1,
  ChartBarStacked,
  ChevronDown,
  ChevronUp,
  Kanban, 
  ListChecks, 
  Plus, 
  SquareGanttChart, 
  TableCellsSplit 
} from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../../../components/ui/collapsible"
import { Button } from '~/components/ui/button'

const CreateSection = () => {
  const [open, setOpen] = useState(false)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <div className='h-[1px] w-full bg-gray-200 mb-2'/>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between hover:bg-white text-md py-4">
          Create...
          {open ? <ChevronDown/> : <ChevronUp/>}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 mt-2">
      <ButtonFormat>
        <TableCellsSplit className='text-blue-600' strokeWidth={1.25}/>
        Grid
      </ButtonFormat>
      <ButtonFormat>
        <Calendar1 className='text-orange-600' strokeWidth={1.25}/>
        Calendar
      </ButtonFormat>
      <ButtonFormat>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-purple-700">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
        </svg>
        Gallery
      </ButtonFormat>

      <ButtonFormat>
        <Kanban className='text-green-600' strokeWidth={1.25}/>
        Kanban
      </ButtonFormat>
      <ButtonFormat>
        <ChartBarStacked className='text-red-600' strokeWidth={1.25}/>
        Timeline
      </ButtonFormat>

      <ButtonFormat>
        <ListChecks className='text-blue-800' strokeWidth={1.25}/>
        List
      </ButtonFormat>
       <ButtonFormat>
        Section
      </ButtonFormat>


      <div className='h-[1px] w-full bg-gray-200 my-3' />
      <ButtonFormat>
        <SquareGanttChart className='text-fuchsia-600' strokeWidth={1.25}/>
        Form
      </ButtonFormat>

      </CollapsibleContent>
    </Collapsible>
  )
}

const ButtonFormat = ({ children }: { children: React.ReactNode }) => (
  <Button variant="ghost" className="w-full justify-start text-sm rounded-xs m-0">
    <div className='flex justify-between items-center w-full'>
      <div className='flex flex-row items-center gap-2'>
        {children}
      </div>
      <Plus className='text-gray-800' strokeWidth={1.25}/>
    </div>
  </Button>
)

export default CreateSection
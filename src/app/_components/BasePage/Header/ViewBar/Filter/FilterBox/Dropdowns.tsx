import { ChevronDown, Trash2 } from 'lucide-react';
import React from 'react'
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import type { Conjunction, DeleteProps, DropdownProps, Operator } from '../type';
import type { Column } from '~/app/types/props';
import api from '~/trpc/react';
export const ConjunctionDropdown: React.FC<DropdownProps<Conjunction>> = ({ value, onChange }) => {
  const conjunctions: Conjunction[] = ['and', 'or']
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="w-14 outline outline-gray-200 flex flex-row justify-between items-center p-1 px-2 rounded-xs">
          <p className="text-sm">
            {value}
          </p>
          <ChevronDown className="w-4 h-4 text-gray-700"/>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-14 rounded-xs">
        {conjunctions.map((conjunction) => (
          <DropdownMenuItem key={conjunction} onClick={() => onChange(conjunction)}>
            {conjunction}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Select column dropdown
export const FieldDropdown: React.FC<DropdownProps<string>> = ({ value, onChange, columns }) => {
  return (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <div className="w-32 outline outline-gray-200 flex flex-row justify-between items-center p-1 px-2 rounded-xs">
        <p className="text-sm">{value}</p>
        <ChevronDown className="w-4 h-4 text-gray-700" />
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="min-w-32 rounded-xs">
      {/* TODO: use actual fields */}
      {columns?.map((column: Column) => (
        <DropdownMenuItem key={column.name} onClick={() => onChange(column.name)}>
          {column.name}
        </DropdownMenuItem>
      ))}
    
    </DropdownMenuContent>
  </DropdownMenu>
);}

// TODO: update operators to be based on type (num/text)
export const OperatorDropdown: React.FC<DropdownProps<Operator>> = ({ value, onChange }) => {
  const operators: Operator[] = [
    'contains',
    'does not contain',
    'is',
    'is not',
    'is empty',
    'is not empty',
  ]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className='w-32 outline outline-gray-200 flex flex-row justify-between items-center p-1 px-2 rounded-xs'>
          <p className='text-sm truncate'>{value}</p>
          <ChevronDown className='w-4 h-4 text-gray-700'/>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='min-w-32 rounded-xs'>
        {operators.map((op) => (
          <DropdownMenuItem key={op} onClick={() => onChange(op)}>
            {op}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Delete filter button
export const Delete: React.FC<DeleteProps> = ({ onClick }) => {
  return (
    <div className="outline outline-gray-200">
      <Button onClick={onClick} variant="ghost" className=" rounded-none flex justify-center items-center p-2 h-7">
        <Trash2 className="h-4 w-4"/>
      </Button>
    </div>
  )
}

// Query value input
export const ValueInput: React.FC<DropdownProps<string>> = ({ value, onChange }) => {
  const handleValueUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
    // TODO
    console.log('Query value', e.target.value)
  }
  return (
    <input placeholder="Enter a value" className="p-2 h-7 w-32 text-sm outline outline-gray-200"
    onChange={(e) => handleValueUpdate(e)}
    >
    </input>
  )
}
export default OperatorDropdown
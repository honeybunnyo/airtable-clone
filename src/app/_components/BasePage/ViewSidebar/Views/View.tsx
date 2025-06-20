import { Check, TableCellsSplit } from 'lucide-react'
import React from 'react'

const View = ({selected}: {selected: boolean}) => {
  return (
    <div className={`${selected ? 'bg-[#d6f2fe]' : 'bg-white hover:bg-gray-100'} content-center items-center w-full h-[32px] py-1 px-2 rounded-xs text-sm font-medium flex flex-row justify-between`}>
      <div className="flex flex-row content-center items-center gap-2">
      <TableCellsSplit className="w-4 h-4 text-blue-800" strokeWidth={1}/>
      Grid view
      </div>
      { selected && <Check className="w-4 h-4" strokeWidth={1}/> }
    </div>
  )
}

export default View
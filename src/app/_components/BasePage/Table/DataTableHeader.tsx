import React from 'react'
import ColumnContextMenu from './ColumnContextMenu';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import type { DataTableHeaderProps } from '~/app/types/props';

const DataTableHeader = ({ columns, matchingColumns }: DataTableHeaderProps) => {

  return (
    <thead className="sticky -top-px border">
      <tr className="h-[32px]">
        <th className="w-[50px] font-light bg-[#f4f4f4] text-sm border border-gray-200">
          <div className="flex justify-center items-center">
            <input
              type="checkbox"
              value=""
              className="w-3 h-3 text-blue-600 bg-gray-100 rounded-sm"
            />
          </div>
        </th>
        {columns?.map((col) =>{

          const isHighlighted = matchingColumns.some((mc) => mc.id === col.id);
         return (
            <th
            id={col.id}
            key={`col-${col.id}`}
            className={`border border-gray-200 w-[180px] font-light text-sm ${
              isHighlighted ? 'bg-[#fff3d2]' : 'bg-[#f4f4f4]'
            }`}
            >
            <ColumnContextMenu columnId={col.id}>
              <div className="flex flex-row justify-between items-center px-2 cursor-context-menu w-full">
                <div className="flex flex-row items-center">
                  {col.type === 'NUMBER' ? (
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
                  {col.name}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </div>
            </ColumnContextMenu>
          </th>
        )})}
      </tr>
    </thead>
  )
}

export default DataTableHeader
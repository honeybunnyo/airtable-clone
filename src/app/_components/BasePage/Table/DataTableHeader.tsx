import React from 'react'
import ColumnContextMenu from './ColumnContextMenu';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';

type Column = {
  tableId: string;
  type: string;
  name: string;
  id: string;
  order: number;
}

type DataTableHeaderProps = {
  columns: Column[];
}

const DataTableHeader = ({ columns }: DataTableHeaderProps) => {
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
        {columns?.map((col) => (
          <th
            key={`col-${col.id}`}
            className="border border-gray-200 w-[180px] font-light bg-[#f4f4f4] text-sm"
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
        ))}
      </tr>
    </thead>
  )
}

export default DataTableHeader
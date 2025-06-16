import React from 'react'
import ColumnContextMenu from './ColumnContextMenu';
import type { DataTableHeaderProps } from '~/app/types/props';

const DataTableHeader = ({ columns, matchingColumns, colToDelete, setColDelete }: DataTableHeaderProps) => {
  return (
    <thead className="sticky -top-px border">
      <tr className="h-[32px]">
        <th className="w-[50px] font-light bg-[#f4f4f4] text-sm border border-gray-200">
          <div className="flex justify-center items-center">
            <input type="checkbox" value=""
              className="w-3 h-3 text-blue-600 bg-gray-100 rounded-sm"
            />
          </div>
        </th>
        {columns?.map((col) => {
          if (col.id == colToDelete) {
            return
          }
          const isHighlighted = matchingColumns.some((mc) => mc.id === col.id);
          return (
            <th id={col.id} key={`col-${col.id}`}
              className={`border border-gray-200 w-[180px] font-light text-sm ${
                isHighlighted ? 'bg-[#fff3d2]' : 'bg-[#f4f4f4]'
              }`}>
              <ColumnContextMenu column={col} setColDelete={setColDelete}/>
            </th>
          )}
        )}
      </tr>
    </thead>
  )
}

export default DataTableHeader
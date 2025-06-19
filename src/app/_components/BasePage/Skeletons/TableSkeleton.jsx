import React from 'react'

export function TableSkeleton() {
  return  (
    <div className="h-full overflow-auto">
      <table className="border-collapse table-fixed">
        <thead>
          <tr className="h-[32px]">
            {/* First column checkbox */}
            <th className="min-w-[50px] w-[50px] font-light bg-[#f4f4f4] text-sm border border-gray-300">
              <div className="flex justify-center items-center">
                <div className="w-144 h-3 bg-gray-300 rounded-sm animate-pulse" />
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {[...Array(10)].map((_, rowIdx) => (
            <tr key={rowIdx} className="flex content-center w-full h-[32px]">
              <td className="min-w-[50px] border-b border-r border-gray-200 font-light text-sm">
                <div className="flex items-center justify-center h-full w-full">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              </td>
              {[...Array(3)].map((_, colIdx) => (
                <td
                  key={colIdx}
                  className="border-r border-b border-gray-200 px-2 py-1 truncate w-[180px] flex items-center justify-center"
                  style={{ minWidth: 180 }}
                >
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableSkeleton
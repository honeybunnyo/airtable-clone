import React from 'react'
import BigSpinner from '../../Common/BigSpinner'

export function TableSkeleton() {
  return (
    <div className="h-full flex justify-center items-center flex-grow">
        <BigSpinner/>
    </div>
  )
}


export default TableSkeleton
'use client'

import TableSkeleton from "~/app/_components/BasePage/Skeletons/TableSkeleton"

export default function BaseLoadingPage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-row items-center bg-greentheme min-h-[88px]"/>
      <div className="flex flex-row items-center bg-white border h-[44px] px-4 gap-4">
        <div className="bg-gray-100 w-20 h-5 rounded-2xl"/>
        <div className="bg-gray-100 w-35 h-5 rounded-2xl"/>
        <div className="bg-gray-100 w-8 h-5 rounded-2xl"/>
        <div className="bg-gray-100 w-8 h-5 rounded-2xl"/>
        <div className="bg-gray-100 w-8 h-5 rounded-2xl"/>
        <div className="bg-gray-100 w-8 h-5 rounded-2xl"/>
        <div className="bg-gray-100 w-8 h-5 rounded-2xl"/>
        <div className="bg-gray-100 w-35 h-5 rounded-2xl"/>
        <div className="bg-gray-100 w-24 h-5 rounded-2xl"/>
        <div className="bg-gray-100 w-24 h-5 rounded-2xl"/>
      </div>
      <TableSkeleton/>
    </div>
  )
}

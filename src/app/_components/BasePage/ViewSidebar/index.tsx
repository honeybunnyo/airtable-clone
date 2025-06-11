import {
  Search, 
  Settings,
} from 'lucide-react'
import React from 'react'
import CreateSection from './CreateSection'

type ViewSideBarProps = {
  sideBarOpen: boolean;
}

const ViewSideBar = ({ sideBarOpen }: ViewSideBarProps) => {
  return (
    <div className={`${sideBarOpen ? "translate-x-0" : "-translate-x-full"} h-full w-[200px] flex flex-col justify-between shrink-0 border-r-1 border-gray-300 bg-white p-3 border-t-1`}>
      <div className="flex flex-row justify-center align-center gap-2 px-2 focus-within:border-blue-500 border-b">
        <Search className="h-6 w-6 text-gray-600" strokeWidth={1.25}/>
        <input className="focus:outline-none w-full text-sm pb-3" placeholder="Find a view "></input>
        <Settings className="h-5 w-5 text-gray-600 rotate-30 shrink-0" strokeWidth={1.25}/>
      </div>
      <CreateSection/>
    </div>
  )
}

export default ViewSideBar
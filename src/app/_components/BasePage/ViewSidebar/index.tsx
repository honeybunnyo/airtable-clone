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
    <aside className={`${sideBarOpen ? "w-[200px] p-3" : "w-[0px] p-0"} transform transition-all overflow-hidden duration-300 h-full flex flex-col justify-between shrink-0 border-gray-300 bg-white border-t`}>
      <div className={`${sideBarOpen ? "block" : "hidden"}`}>
        <div className="flex flex-row justify-center align-center gap-2 px-2 focus-within:border-blue-500 border-b">
          <Search className="h-6 w-6 text-gray-600" strokeWidth={1.25}/>
          <input className="focus:outline-none w-full text-sm pb-3" placeholder="Find a view "></input>
          <Settings className="h-5 w-5 text-gray-600 rotate-30 shrink-0" strokeWidth={1.25}/>
        </div>
        <CreateSection/>
      </div>
    </aside>
  )
}

export default ViewSideBar
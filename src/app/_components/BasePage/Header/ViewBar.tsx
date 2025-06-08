import { ArrowDownUp, ChevronDown, EyeOff, List, ListFilter, Menu, PaintBucket, Search, Sparkle, TableCellsSplit } from 'lucide-react'
import React from 'react'
import FormatIcon from '../../Ui/FormatIcon'
import { Button } from '~/components/ui/button'

const ViewBar = () => {
  return (
    <div className='h-[44px] text-black flex flex-row justify-between items-center px-3 outline-1'>
      <div className='flex flex-row items-center font-medium text-sm gap-2'>
        <ButtonFormat>
          <FormatIcon icon={Menu} /> Views
        </ButtonFormat>
        <div className='w-[1px] h-4 bg-gray-300'/>
        <ButtonFormat>
          <TableCellsSplit className="w-4 h-4 text-blue-800" strokeWidth={1}/>
          Grid View
          <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="User / Users_Group"> <path id="Vector" d="M17 20C17 18.3431 14.7614 17 12 17C9.23858 17 7 18.3431 7 20M21 17.0004C21 15.7702 19.7659 14.7129 18 14.25M3 17.0004C3 15.7702 4.2341 14.7129 6 14.25M18 10.2361C18.6137 9.68679 19 8.8885 19 8C19 6.34315 17.6569 5 16 5C15.2316 5 14.5308 5.28885 14 5.76389M6 10.2361C5.38625 9.68679 5 8.8885 5 8C5 6.34315 6.34315 5 8 5C8.76835 5 9.46924 5.28885 10 5.76389M12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14Z" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg>
          <FormatIcon icon={ChevronDown} />
        </ButtonFormat>
        <ButtonFormat>
          <FormatIcon icon={EyeOff} />
        </ButtonFormat>
        <ButtonFormat>
          <FormatIcon icon={ListFilter} />
        </ButtonFormat>
        <ButtonFormat>
          <FormatIcon icon={List} />
        </ButtonFormat>
        <ButtonFormat>
          <FormatIcon icon={ArrowDownUp} />
        </ButtonFormat>
        <ButtonFormat>
          <FormatIcon icon={PaintBucket} />
        </ButtonFormat>
        <ButtonFormat>
          <div className='h-5 w-5'>
            <svg viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(180)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M13 6L21 6.00048M13 12L21 12.0005M13 18L21 18.0005M6 4V20M6 4L3 7M6 4L9 7M6 20L3 17M6 20L9 17" stroke="#000000" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
          </div>
        </ButtonFormat>
        <ButtonFormat>
          <FormatIcon icon={Sparkle} />
          <p className='font-light'>
            Create Ai Fields
          </p>
        </ButtonFormat>
      </div>
      <Search className='h-4 w-4' strokeWidth={1}/>
    </div>
  )
}

const ButtonFormat = ({ children }: { children: React.ReactNode }) => (
  <Button variant="ghost" className='flex items-center justify-center gap-1 flex-row h-6 p-0 rounded-xs'>
    {children}
  </Button>
)

export default ViewBar
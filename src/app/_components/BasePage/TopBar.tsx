'use client';
import React, { useState, useEffect } from 'react'
import { ChevronDown, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { api } from '~/trpc/react'
import { useRouter } from 'next/navigation';
import CreateTableButton from './CreateTableButton';

const TopBar = () => {
  const [isHoveringBackButton, setIsHoveringBackButton] = useState(false)
  const params = useParams()
  const router = useRouter();

  const baseId = typeof params?.baseId === 'string' ? params.baseId : undefined
  const tableId = typeof params?.tableId === 'string' ? params.tableId : undefined

  const { data: base, isLoading } = api.base.getBaseById.useQuery(
    { id: baseId! },
    { enabled: !!baseId }
  )

  const [name, setName] = useState(base?.name ?? '');

  useEffect(() => {
  if (base?.name) {
      setName(base.name);
    }
  }, [base?.name]);

  if (!baseId || typeof baseId !== 'string') return null;
  if (isLoading) return <div>Loading...</div>

  const openExtensionOptions = () => {
    console.log('Opening Extension options')
  }

  const openToolsOptions = () => {
    console.log('Opening Tools options')
  }

  const utils = api.useUtils();
  const updateBaseNameMutation = api.base.updateBaseName.useMutation({
    onSuccess: () => {
      void utils.base.getBaseById.invalidate();
    }
  });

  const goHome = async () => {
    router.push('/');
  };

  return (
    <div className='text-white'>
      {/* Top */}
      <div className='flex items-center justify-between px-2 flex-auto bg-[#407c49] h-[56px] pl-3'>
        {/* Left */}
        <div className='flex flex-row'>
          <button
          onClick={goHome}
          onMouseEnter={() => setIsHoveringBackButton(true)}
          onMouseLeave={() => setIsHoveringBackButton(false)}>
            { isHoveringBackButton ? 
              <div className='bg-white rounded-3xl p-1'>
                <ArrowLeft className="w-3 h-3 text-[#407c49]"/>
              </div>
            :          
            <Image
            src="/airtable-white.svg"
            alt="Back to home"
            width={30}
            height={20}
            className="cursor-pointer w-6 h-6"
            />
          }
          </button>
          <input className='outline-none px-2 w-[200px] text-lg font-bold' value={name} onChange={(e) => setName(e.target.value)}
            onBlur={async () => {
              if (name !== base?.name) {
                await updateBaseNameMutation.mutateAsync({ id: baseId, name });
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.currentTarget.blur();
              }
          }}/>
          <button className='rounded-3xl px-3 py-1 bg-[#396f42] text-sm inset-shadow-sm inset-shadow-green-800'>
            Data
          </button>
          {topNav("Automations")}
          {topNav("Interfaces")}
          {topNav("Forms")}
        </div>

        {/* Right */}
        <div>
          {topNav("Help")}
          {topNav("Share")}
          {topNav("Notification")}
          {topNav("Profile")}
        </div>
      </div>

      {/* Bottom */}
      <div className='flex items-center justify-between flex-auto bg-[#407c49] h-[32px] gap-2 text-sm font-light'>
        {/* First panel */}
        <div className='flex flex-row bg-[#396f42] h-full w-full rounded-t-md content-center pl-3'>
            {base && base.tables.map((table) => (
              <Link key={`${baseId}/${table.id}`} href={`/base/${baseId}/${table.id}`}>
                <div key={table.id} className={`w-full h-full text-left px-4 py-2 text-sm rounded-t-sm ${
                  table.id === tableId ? 'font-semibold bg-white text-black' : 'font-light hover:bg-[#34643b] text-white'
                }`}>{table.name}</div>
              </Link>
            ))}
          <CreateTableButton baseId={baseId} />
        </div>
        {/* Second panel */}
        <div className='flex flex-row bg-[#396f42] h-full rounded-tl-md'>
          <button onClick={openExtensionOptions} className='px-3 content-center'>
            Extensions
          </button>
          <button onClick={openToolsOptions} className='flex flex-row px-3 items-center gap-1'>
              Tools
            <ChevronDown className="w-4 h-4" strokeWidth={1}/>
          </button>
        </div>
      </div>
    </div>
  )
}

const topNav = (text:string) => (
  <button className='rounded-3xl px-3 py-1 hover:bg-[#396f42] text-sm'>
    {text}
  </button>
)
export default TopBar
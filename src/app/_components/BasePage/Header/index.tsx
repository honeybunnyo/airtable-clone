'use client';
import React  from 'react'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { api } from '~/trpc/react'
import TopBar from './TopBar';
import CreateTableButton from './CreateTableButton';

const Page = () => {
  const params = useParams()

  const baseId = typeof params?.baseId === 'string' ? params.baseId : undefined
  const tableId = typeof params?.tableId === 'string' ? params.tableId : undefined

  const { data: base, isLoading } = api.base.getBaseById.useQuery(
    { id: baseId! },
    { enabled: !!baseId }
  )

  if (!baseId || typeof baseId !== 'string') return null;
  if (isLoading) return <div>Loading...</div>

  const openExtensionOptions = () => { console.log('Opening Extension options') }
  const openToolsOptions = () => { console.log('Opening Tools options') }

  return (
    <div className='text-white'>
      <TopBar/>
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

export default Page
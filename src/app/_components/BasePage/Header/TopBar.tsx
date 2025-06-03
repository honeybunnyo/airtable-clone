'use client';

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Check } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { api } from '~/trpc/react'
import { useRouter } from 'next/navigation';
import { useGlobalSaving } from '~/lib/stores/useGlobalSaving';
import LoadingSpinner from './LoadingSpinner';
import WithToolTip from '../../Ui/WithToolTip';

const TopBar = () => {
  const { isSaving } = useGlobalSaving();
  const [isHoveringBackButton, setIsHoveringBackButton] = useState(false)
  const params = useParams()
  const router = useRouter();
  const baseId = typeof params?.baseId === 'string' ? params.baseId : undefined

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
        <div className='flex flex-row items-center'>
          {isSaving ? 
            <LoadingSpinner/>
            : 
            <p className='flex px-2 flex-row text-xs text-[#c0d5c3]'>
              <WithToolTip content="All changes saved">
                <Check className='w-4 h-4'/>
              </WithToolTip>
            </p>
          }
          {topNav("Help")}
          {topNav("Share")}
          {topNav("Notification")}
          {topNav("Profile")}
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
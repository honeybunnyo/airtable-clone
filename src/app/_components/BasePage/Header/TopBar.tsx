'use client';

import React, { useState, useEffect } from 'react'
import { ArrowLeft, Bell, Check, CircleHelp, History, Sparkle, UsersRound } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { api } from '~/trpc/react'
import { useRouter } from 'next/navigation';
import { useGlobalSaving } from '~/lib/stores/useGlobalSaving';
import LoadingSpinner from './LoadingSpinner';
import WithToolTip from '../../Ui/WithToolTip';
import { useSession } from 'next-auth/react'
import UserMenu from '../../Dashboard/UserMenu';
import VerticalSeparator from '../../Ui/VerticalSeparator';

const TopBar = () => {
  const { data: session } = useSession()
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
      <div className='flex items-center justify-between px-2 flex-auto bg-greentheme h-[56px] pl-3'>
        {/* Left */}
        <div className='flex flex-row items-center justify-between gap-3'>
          <button
            onClick={goHome}
            onMouseEnter={() => setIsHoveringBackButton(true)}
            onMouseLeave={() => setIsHoveringBackButton(false)}
            className="shrink-0 w-[32px] h-[32px] flex items-center justify-center"
          >
            {isHoveringBackButton ? (
              <div className="bg-white rounded-3xl p-1">
                <ArrowLeft className="w-3 h-3 text-greentheme cursor-pointer" />
              </div>
            ) : (
              <Image
                src="/airtable-white.svg"
                alt="Back to home"
                width={24}
                height={24}
                className="w-6 h-6 "
              />
            )}
          </button>
          <input className='truncate overflow-hidden whitespace-nowrap max-w-100 w-1/2 min-w-10 outline-none px-2 text-lg font-bold' value={name} onChange={(e) => setName(e.target.value)}
            size={name.length || 1}
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
          <button className='rounded-3xl px-3 py-1 bg-greentheme-dark text-sm inset-shadow-sm inset-shadow-black/20'>
            Data
          </button>
          {topNav("Automations")}
          {topNav("Interfaces")}
          <VerticalSeparator/>
          {topNav("Forms")}
        </div>

        {/* Right */}
        <div className='flex flex-row items-center gap-5 pl-5'>
          {isSaving ? 
            <LoadingSpinner/>
            : 
            <p className='flex px-2 flex-row text-xs text-[#c0d5c3]'>
              <WithToolTip content="All changes saved">
                <Check className='w-4 h-4'/>
              </WithToolTip>
            </p>
          }
          <div className="flex flex-row justify-center h-7 items-center cursor-pointer gap-1">
            <History className="w-4 h-4 text-white"/>
          </div>
          <div className="flex flex-row justify-center h-7 items-center cursor-pointer gap-1">
            <CircleHelp className="w-4 h-4 text-white"/>
            <p className='text-xs'>
              Help 
            </p>
          </div>
          <div className="flex flex-row bg-white justify-center h-7 px-3 items-center text-greentheme rounded-full cursor-pointer inset-ring-1 inset-ring-gray-100">
            <UsersRound className="w-5 h-3 text-greentheme"/> 
            <p className='hidden md:block text-sm'>
              Share 
            </p>
          </div>
          <div className=" p-[2px] rounded-4xl bg-[linear-gradient(38deg,_rgb(255,207,136),_rgb(255,142,153),_rgb(191,174,252),_rgb(126,178,255))] shadow-lg shadow-white/30">
            <div className="whitespace-nowrap h-7 flex items-center justify-center bg-white text-greentheme rounded-4xl py-1 px-2 text-sm gap-1">
              <Sparkle className="w-3 h-3 text-greentheme"/>
              AI Assistant
            </div>
          </div>
          <div className="bg-white w-7 h-7 flex items-center justify-center rounded-full cursor-pointer inset-ring-1 inset-ring-gray-100">
            <Bell className="w-4 h-4 text-greentheme" />
          </div>
          {session?.user?.image && (
            <UserMenu session={session} />
          )}
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
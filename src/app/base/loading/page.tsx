'use client'

export default function BaseLoadingPage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-row items-center bg-greentheme h-[88px]"/>
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
      <div className="flex justify-center items-center flex-grow">
        <svg className='w-20 h-20 stroke-[#c0d5c3] animate-spin ' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <g clipPath='url(#clip0_9023_61563)'>
            <path d='M14.6437 2.05426C11.9803 1.2966 9.01686 1.64245 6.50315 3.25548C1.85499 6.23817 0.504864 12.4242 3.48756 17.0724C6.47025 21.7205 12.6563 23.0706 17.3044 20.088C20.4971 18.0393 22.1338 14.4793 21.8792 10.9444' stroke='stroke-current' strokeWidth='1.4' strokeLinecap='round' className='my-path'></path>
          </g>
          <defs>
            <clipPath id='clip0_9023_61563'>
              <rect width='24' height='24' fill='white'></rect>
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  )
}

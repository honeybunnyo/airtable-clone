import React from 'react'

type Base = {
  id: string;
  name: string;
  userId: string;
};

type CardProps = {
  base: Base;
};

const Card = ({ base }: CardProps) => {
  return (
    <a
      href={`/base/${base.id}`}
      className="block w-full min-w-[286px] max-w-[572px] h-[92px] bg-white text-black rounded-md outline-1 outline-gray-300 py-2 font-semibold hover:shadow-md shadow-sm"
    >
    <div className='flex flex-row justify-start p-3 gap-5'>
       <div className="w-14 h-14 bg-green-800 rounded-lg flex items-center justify-center text-white text-xl font-medium">
          {base.name.slice(0, 2)}
        </div>
      <div className='flex flex-col items-start font-medium'>
        <h2>
          {base.name}
        </h2>
        <p className='text-xs text-gray-500 font-light'>
          Base
        </p>
      </div>
    </div>
    </a>
  )
}

export default Card
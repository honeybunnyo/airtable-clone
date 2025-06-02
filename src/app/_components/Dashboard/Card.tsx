import Link from 'next/link';
import React, {useState} from 'react'
import type { Base } from '~/app/types/schema';
import { api } from '~/trpc/react';
import { Trash } from 'lucide-react';

type CardProps = {
  base: {
    id: string;
    name: string;
    tables: { id: string }[];
  };
};

const Card = ({ base }: CardProps) => {
  const firstTableId = base.tables?.[0]?.id
  const [hovering, setHovering] = useState(false)

  const href = firstTableId ? `/base/${base.id}/${firstTableId}` : `/base/${base.id}`

  const utils = api.useUtils()
  const deleteBase = api.base.deleteBase.useMutation({
    onSuccess: async () => {
      await utils.base.getAllBases.invalidate()
    }
  })

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault() // prevent navigation
    e.stopPropagation()
    deleteBase.mutate({ id: base.id })
  }
  return (
    <div
      className="relative w-full min-w-[286px] max-w-[572px] h-[92px]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Link
        href={href}
        className="block w-full h-full bg-white text-black rounded-md outline-1 outline-gray-300 py-2 font-semibold hover:shadow-md shadow-sm"
      >
        <div className="flex flex-row justify-start p-3 gap-5 h-full">
          <div className="w-14 h-14 bg-green-800 rounded-lg flex items-center justify-center text-white text-xl font-medium">
            {base.name.slice(0, 2)}
          </div>
          <div className="flex flex-col items-start font-medium">
            <h2>{base.name}</h2>
            <p className="text-xs text-gray-500 font-light">Base</p>
          </div>
        </div>
      </Link>

      {hovering && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 px-2 py-1 rounded z-10"
        >
          <Trash
          className="absolute top-2 right-2 w-4 h-4 text-red-800 rounded hover:text-red-600 z-10"
          />
        </button>
      )}
    </div>
  )
}

export default Card
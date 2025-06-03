'use client';

import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';

const CreateBaseButton = () => {
  const router = useRouter();
  const createBase = api.base.create.useMutation();

  const handleCreate = async () => {
    try {
      const {baseId, tableId} = await createBase.mutateAsync();
      router.push(`/base/${baseId}/${tableId}`);
    } catch (err: unknown) {
      console.error("Error creating base", err);
    }
  };

  return (
    <button
      onClick={handleCreate}
      className="block text-xs w-full max-h-[265px] text-center bg-blue-500 text-white rounded py-2 font-semibold hover:bg-blue-600 shadow-sm"
    >
      + Create
    </button>
  );
}

export default CreateBaseButton
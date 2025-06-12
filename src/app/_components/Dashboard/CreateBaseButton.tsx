'use client';

import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';

const CreateBaseButton = () => {
  const router = useRouter();
  const createBase = api.base.create.useMutation();
  const createTable = api.table.create.useMutation();

  const handleCreate = async () => {
    router.push("/base/loading");

    try {
      const { baseId } = await createBase.mutateAsync();
      const { tableId } = await createTable.mutateAsync({ baseId, name: "Table 1" });
      router.replace(`/base/${baseId}/${tableId}`);
      
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
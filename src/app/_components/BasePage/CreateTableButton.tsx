import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../components/ui/tooltip"
import { api } from '~/trpc/react';

const CreateTableButton = ({ baseId }: { baseId: string } ) => {
  const utils = api.useUtils();
  const createTable = api.table.create.useMutation({
    onSuccess: async () => {
    await utils.base.getBaseById.invalidate({ id: baseId });
  },
  });

  const createNewTable = async () => {
    await createTable.mutateAsync({
      baseId: baseId,
      name: 'Table 2',
    });
  };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button onClick={createNewTable} className='px-2 hover:text-gray-50 text-lg'>
          +
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add or import table</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default CreateTableButton
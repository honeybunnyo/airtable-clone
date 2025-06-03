import React from 'react'
import { api } from '~/trpc/react';
import WithToolTip from '../Ui/WithToolTip';

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
    <WithToolTip content="Add or import table">
      <button onClick={createNewTable} className='px-2 hover:text-gray-50 text-lg'>
        +
      </button>
    </WithToolTip>
  )
}

export default CreateTableButton
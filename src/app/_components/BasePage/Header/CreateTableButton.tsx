import React, { useState } from 'react'
import { api } from '~/trpc/react';
import WithToolTip from '../../Ui/WithToolTip';
import { withGlobalSaving } from '~/lib/utils';
import { Button } from "../../../../components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../components/ui/dialog"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"

const CreateTableButton = ({ baseId }: { baseId: string } ) => {
  const [open, setOpen] = useState(false);
  const [tableName, setTableName] = useState("Table X")
  const [addingTable, setAddingTable] = useState(false)
    
  const utils = api.useUtils();
  const createTable = api.table.create.useMutation({
    onSuccess: async () => {
    await utils.base.getBaseById.invalidate({ id: baseId });
  },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!tableName) {
      return
    }

    setAddingTable(true)
    await withGlobalSaving(() => createTable.mutateAsync({
      baseId: baseId,
      name: tableName ?? 'Table X',
    })
    )
    setOpen(false);
    setAddingTable(false)
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <WithToolTip content="Add or import table">
          <button onClick={() => setOpen(true)} className='px-2 hover:text-gray-50 text-lg'>
            +
          </button>
        </WithToolTip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New table</DialogTitle>
          </DialogHeader>
          <div className="my-4 grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="table-name-1">Name</Label>
              <Input 
                id="table-name-1" name="name" defaultValue="Table X" autoComplete="off"
                onChange={(e) => setTableName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {addingTable ?
              <Button disabled>Adding... </Button>
              :
              <Button type="submit">Create Table</Button>
            }
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateTableButton
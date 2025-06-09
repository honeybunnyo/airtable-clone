import React, { useState } from 'react'
import { api } from '~/trpc/react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select"
import WithToolTip from '../../Ui/WithToolTip';

type AddColumnDialogProps = {
  tableId: string;
};

const AddColumnDialog: React.FC<AddColumnDialogProps> = ({ tableId }) => {
  const [newColumnName, setNewColumnName] = useState("")
  const [newColumnType, setNewColumnType] = useState<"TEXT" | "NUMBER">("TEXT")
  const [addingColumn, setAddingColumn] = useState(false)
  const createColumn = api.column.create.useMutation();
  const { refetch } = api.table.getTableById.useQuery({ id: tableId });
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newColumnName) {
      return
    }
    
    setAddingColumn(true)
    await createColumn.mutateAsync({
      tableId,
      name: newColumnName,
      type: newColumnType,
    })
    setAddingColumn(false)
    setNewColumnName("")
    setNewColumnType("TEXT")
    setOpen(false);

    await refetch()
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <WithToolTip content='Add field'>
          <button onClick={() => setOpen(true)}
            className="h-[32px] w-30 text-gray-600 border border-gray-200 bg-gray-100 hover:bg-gray-200 text-lg"
            >
            ＋
          </button>
        </WithToolTip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add column</DialogTitle>
          </DialogHeader>
          <div className="my-4 grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="column-name-1">Column Name</Label>
              <Input 
                id="column-name-1" name="name" defaultValue="" autoComplete='off'
                onChange={(e) => setNewColumnName(e.target.value)}
              />
            </div>
              <Label htmlFor="type-1">Select Type</Label>
            <Select value={newColumnType} onValueChange={(val) => setNewColumnType(val as "TEXT" | "NUMBER")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Value type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TEXT">Text</SelectItem>
                <SelectItem value="NUMBER">Number</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {addingColumn ?
            <Button disabled>Adding... </Button>
            :
            <Button type="submit">Add Column</Button>
          }
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddColumnDialog
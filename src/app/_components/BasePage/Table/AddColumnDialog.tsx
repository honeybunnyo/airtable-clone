import React, { useEffect, useState } from 'react'
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import WithToolTip from '../../Common/WithToolTip';
import { withGlobalSaving } from '~/lib/utils';
import { useTableMutations } from '~/app/hooks/useTableMutations';
import { api } from '~/trpc/react'

type AddColumnDialogProps = {
  tableId: string;
};

const AddColumnDialog: React.FC<AddColumnDialogProps> = ({ tableId }) => {
  const [newColumnName, setNewColumnName] = useState("")
  const [newColumnType, setNewColumnType] = useState<"TEXT" | "NUMBER">("TEXT")
  const { createColumn } = useTableMutations(tableId);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [open, setOpen] = useState(false);

  const { data: columns } = api.table.getTableColumns.useQuery({ tableId });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newColumnName.trim()) return;
    const nameExists = columns?.some(
      (col) => col.name.trim().toLowerCase() === newColumnName.trim().toLowerCase()
    );

    if (nameExists) {
      setAlreadyExists(true);
      return;
    }

    setAlreadyExists(false);
    setOpen(false);

    await withGlobalSaving(() => createColumn.mutateAsync({
      tableId,
      name: newColumnName,
      type: newColumnType,
    }))
    setNewColumnName("")
    setNewColumnType("TEXT")
  }

  useEffect(() => {
    if (open) setAlreadyExists(false);  
  }, [open]);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <WithToolTip content='Add field'>
          <button onClick={() => setOpen(true)}
            className="sticky -top-px h-[33px] min-w-30 text-gray-600 border-r border-y border-gray-200 bg-gray-100 hover:bg-gray-200 text-lg"
            >
            ＋
          </button>
        </WithToolTip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] h-76">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add column</DialogTitle>
          </DialogHeader>
          <div className="my-4 grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="column-name-1">Column Name</Label>
              <Input 
                id="column-name-1" name="name" defaultValue="" autoComplete="off"
                onChange={(e) => setNewColumnName(e.target.value)}
                className={`${alreadyExists ? 'bg-red-100 border-red-300' : ''}`}
              />
              {alreadyExists && (
                <p className="text-xs text-red-500">
                  Column name already exists
                </p>
              )}
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
            <Button type="submit">Add Column</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddColumnDialog
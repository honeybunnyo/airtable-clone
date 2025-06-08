import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "../../../../components/ui/dialog"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { api } from "~/trpc/react"
import { withGlobalSaving } from "~/lib/utils"

interface CreateTableDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  baseId: string
}

export const CreateTableDialog = ({ open, setOpen, baseId }: CreateTableDialogProps) => {
  const [tableName, setTableName] = useState("Table X")
  const [addingTable, setAddingTable] = useState(false)

  const utils = api.useUtils()
  const createTable = api.table.create.useMutation({
    onSuccess: async () => {
      await utils.base.getBaseById.invalidate({ id: baseId })
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!tableName) return

    setAddingTable(true)
    await withGlobalSaving(() =>
      createTable.mutateAsync({
        baseId,
        name: tableName,
      })
    )
    setOpen(false)
    setAddingTable(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>New table</DialogTitle>
          </DialogHeader>
          <div className="my-4 grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="table-name-1">Name</Label>
              <Input
                id="table-name-1"
                name="name"
                defaultValue="Table X"
                autoComplete="off"
                onChange={(e) => setTableName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {addingTable ? <Button disabled>Adding...</Button> : <Button type="submit">Create Table</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
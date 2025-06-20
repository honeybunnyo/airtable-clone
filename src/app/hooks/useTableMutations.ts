import { api } from '~/trpc/react';
import { toast } from 'sonner';
import { useEditedCellsStore } from '~/lib/stores/useEditedStore';
import { useCancelledColumns } from '~/lib/stores/cancelledColumnsStore';


export const useTableMutations = (tableId: string) => {
  const { transferColumnData } = useEditedCellsStore();
  const { isCancelled } = useCancelledColumns();
  const utils = api.useUtils();
  const { editedCells, clearEditedCell } = useEditedCellsStore.getState();
  const updateCellMutation = api.table.updateCell.useMutation();

  // Clear any temp cells related to this column
  const clearTempCells = (name: string) => {
    Object.keys(editedCells).forEach((key) => {
      if (key.endsWith(`-temp-${name}`)) {
        clearEditedCell(key);
      }
    });
  }

  const createColumn = api.column.create.useMutation({
    onMutate: async (variables) => {
      await utils.table.getTableColumns.cancel({ tableId });

      const previousColumns = utils.table.getTableColumns.getData({ tableId });

      // Create an optimistic update for the new column
      const optimisticColumn = {
        id: `temp-${variables.name}`,
        tableId,
        name: variables.name,
        type: variables.type,
        order: previousColumns?.length ?? 0,
      };

      utils.table.getTableColumns.setData({ tableId }, (old) => [...(old ?? []), optimisticColumn]);

      return { previousColumns };
    },
    onError: (_, variables, context) => {
      utils.table.getTableColumns.setData({ tableId }, context?.previousColumns);
      toast.error(`Failed to add column "${variables.name}"`);
      clearTempCells(variables.name)
    },
    onSuccess: async (realColumn, variables, context) => {
      if (isCancelled(variables.name)) {
        console.log(`Column "${variables.name}" was cancelled. Skipping update.`);
        await deleteColumn.mutateAsync({ columnId: realColumn.id })   
        utils.table.getTableColumns.setData({ tableId }, context?.previousColumns);
        clearTempCells(variables.name)
        return;
      }
      const updated = transferColumnData(`temp-${variables.name}`, realColumn.id);

      for (const [cellId, value] of Object.entries(updated)) {
        console.log(`Updating cell ${cellId} with value:`, value);
        await updateCellMutation.mutateAsync({ cellId, value });
      }

      clearTempCells(variables.name)
      await utils.table.getTableColumns.invalidate({ tableId });
      toast.success(`Added column "${variables.name}"`);
    },
  });

  const addRow = api.table.addRow.useMutation({
    onSuccess: async () => {
      await utils.table.getPaginatedRows.invalidate({ tableId });
      toast.success("Row added successfully");
    },
    onError: () => {
      toast.error("Failed to add row");
    },
  });

  const deleteColumn = api.column.delete.useMutation({
    onMutate: async (variables) => {
      toast(`Deleting column...`);
      await utils.table.getTableColumns.cancel({ tableId });
      await utils.table.getPaginatedRows.cancel({ tableId, limit: 2000 });

      const previousColumns = utils.table.getTableColumns.getData({ tableId });
      const previousRows = utils.table.getPaginatedRows.getData({ tableId, limit: 2000 });

      // Optimistically remove the column
      utils.table.getTableColumns.setData({ tableId }, (old) =>
        old?.filter((col) => col.id !== variables.columnId)
      );

      Object.keys(editedCells).forEach((key) => {
        if (key.endsWith(`-${variables.columnId}`)) {
          clearEditedCell(key);
        }
      });

      return { previousColumns, previousRows };   
    },
    onSuccess: async () => {
      await utils.table.getPaginatedRows.invalidate({ tableId });
      await utils.table.getTableColumns.invalidate({ tableId });
      toast.success("Column deleted successfully");
    },
    onError: (_err, _variables, context) => {
      toast.error("Failed to delete column.");

      utils.table.getTableColumns.setData({ tableId }, context?.previousColumns);
      utils.table.getPaginatedRows.setData({ tableId, limit: 2000 }, context?.previousRows);
    },

  });

  return {
    createColumn,
    addRow,
    deleteColumn,
  };
};

import { create } from 'zustand';
import { persist } from 'zustand/middleware';


type EditedCellsState = {
  editedCells: Record<string, string>;
  setEditedCell: (cellId: string, value: string) => void;
  getEditedValue: (cellId: string) => string | undefined;
  clearEditedCell: (cellId: string) => void;
  transferColumnData: (tempColId: string, realColId: string) => Record<string, string>;
};

// Note: This is persisted to localStorage
export const useEditedCellsStore = create<EditedCellsState>()(
  persist(
    (set, get) => ({
      editedCells: {},
      setEditedCell: (cellId, value) => {
        set((state) => ({
          editedCells: { ...state.editedCells, [cellId]: value },
        }));
      },
      getEditedValue: (cellId) => get().editedCells[cellId],
      clearEditedCell: (cellId) => {
        set((state) => {
          const copy = { ...state.editedCells };
          delete copy[cellId];
          return { editedCells: copy };
        });
      },
      transferColumnData: (tempColId, realColId) => {
        console.log(`Transferring data from temp column ${tempColId} to real column ${realColId}`);
        const updated: Record<string, string> = {};
        const copy = { ...get().editedCells };
        console.log('Current edited cells:', copy);
        for (const [key, value] of Object.entries(copy)) {
          console.log(`Processing key: ${key}, value: ${value}`);
          console.log(`Checking if key matches temp column ID: ${tempColId}`);
          const { rowId, columnId } = parseCellId(key);
          console.log(`columnId: ${columnId}, tempColId: ${tempColId}`);
          if (columnId === tempColId) {
            updated[`${rowId}-${realColId}`] = value;
            delete copy[key];
          }
        }
        console.log('Updated edited cells:', updated);
        console.log('Final edited cells after transfer:', { ...copy, ...updated });
        set({ editedCells: { ...copy, ...updated } });
        return updated;
      },
    }),
    {
      name: 'edited-cells-storage',
    }
  )
);

function parseCellId(cellId: string): { rowId: string; columnId: string } {
  const dashIndex = cellId.indexOf('-');
  return {
    rowId: cellId.slice(0, dashIndex),
    columnId: cellId.slice(dashIndex + 1),
  };
}

import { create } from 'zustand';

type CancelledColumnsStore = {
  cancelled: Set<string>;
  cancelColumn: (columnName: string) => void;
  isCancelled: (columnName: string) => boolean;
};

export const useCancelledColumns = create<CancelledColumnsStore>((set, get) => ({
  cancelled: new Set(),
  cancelColumn: (name) => set(state => {
    const next = new Set(state.cancelled);
    next.add(name);
    return { cancelled: next };
  }),
  isCancelled: (name) => get().cancelled.has(name),
}));

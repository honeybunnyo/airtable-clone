import { create } from "zustand";

type GlobalSavingState = {
  isSaving: boolean;
  setSaving: (val: boolean) => void;
}

/**
 * Keep track of when things are being saved to database
 */
export const useGlobalSaving = create<GlobalSavingState>((set) => ({
  isSaving: false,
  setSaving: (val) => set({ isSaving: val }),
}))

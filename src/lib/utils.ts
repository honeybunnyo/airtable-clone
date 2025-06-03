import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useGlobalSaving } from "./stores/useGlobalSaving";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const withGlobalSaving = async (fn: () => Promise<unknown>) => {
  const { setSaving } = useGlobalSaving.getState();
  try {
    setSaving(true);
    return await fn();
  } finally {
    setSaving(false);
  }
};

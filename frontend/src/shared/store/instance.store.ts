import { create } from "zustand";
import type { InstanceSummary } from "../types/instance";

const STORAGE_KEY = "biar-instance";

interface InstanceState {
  activeInstance: InstanceSummary | null;
  setActiveInstance: (instance: InstanceSummary) => void;
  clearActiveInstance: () => void;
  hydrate: () => void;
}

export const useInstanceStore = create<InstanceState>((set) => ({
  activeInstance: null,

  setActiveInstance: (instance) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(instance));
    set({ activeInstance: instance });
  },

  clearActiveInstance: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ activeInstance: null });
  },

  hydrate: () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const instance = JSON.parse(stored) as InstanceSummary;
        if (instance.id) {
          set({ activeInstance: instance });
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  },
}));

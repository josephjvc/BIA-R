import { create } from "zustand";
import type { User } from "../types/auth";

const STORAGE_KEY = "biar-auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

function loadFromStorage(): { token: string | null; user: User | null; isAuthenticated: boolean } {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const { token, user } = JSON.parse(stored);
      if (token && user) return { token, user, isAuthenticated: true };
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  return { token: null, user: null, isAuthenticated: false };
}

export const useAuthStore = create<AuthState>((set) => ({
  ...loadFromStorage(),

  setAuth: (token, user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ token: null, user: null, isAuthenticated: false });
  },
}));

"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * User type from your backend
 */
export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  role?: string;
  phone?: string;
}

/**
 * Auth store state
 */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Auth store actions
 */
interface AuthActions {
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<User>) => void;
}

/**
 * Auth store using zustand with persistence
 * Stores auth state in localStorage
 */
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (loading) =>
        set({
          isLoading: loading,
        }),

      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: "auth-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

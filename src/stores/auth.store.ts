import { proxy, useSnapshot } from "valtio";

import type { User } from "@/types/auth";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

const USER_STORAGE_KEY = "user";

const getInitialUser = (): User | null => {
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

const initialUser = getInitialUser();

const state = proxy<AuthState>({
  user: initialUser,
  isAuthenticated: !!initialUser,
});

const actions = {
  setUser: (user: User) => {
    state.user = user;
    state.isAuthenticated = true;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },
  clearUser: () => {
    state.user = null;
    state.isAuthenticated = false;
    localStorage.removeItem(USER_STORAGE_KEY);
  },
};

export const useAuthStore = () => {
  return { ...useSnapshot(state), ...actions };
};

export const authActions = actions;

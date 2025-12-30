import type { User } from "$lib/types";
import { writable } from "svelte/store";

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

export const auth = writable<AuthState>(initialState);

export const login = (user: User, token: string) => {
  auth.set({ user, token });
};

export const logout = () => {
  auth.set({ user: null, token: null });
}
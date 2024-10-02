import { createStore } from 'zustand/vanilla'

export type SessionState = {
  name: string | undefined;
  userId: number | undefined;
  role: string | undefined;
}

export type SessionActions = {
  setUser: (name: string | undefined, userId: number | undefined, role: string | undefined) => void;
  clearUser: () => void;
}

export type SessionStore = SessionState & SessionActions

export const defaultInitState: SessionState = {
  name: undefined,
  userId: undefined,
  role: undefined,
}

export const createSessionStore = (
  initState: SessionState = defaultInitState,
) => {
  return createStore<SessionStore>()((set) => ({
    ...initState,
    setUser: (name: string | undefined, userId: number | undefined, role: string | undefined) => set(() => ({name, userId, role})),
    clearUser: () => set(() => ({name: undefined, userId: undefined, role: undefined})),
  }));
}
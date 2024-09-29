import { createStore } from 'zustand/vanilla'

export type SessionState = {
  userId: number | undefined;
  role: string | undefined;
}

export type SessionActions = {
  setUser: (userId: number | undefined, role: string | undefined) => void;
  clearUser: () => void;
}

export type SessionStore = SessionState & SessionActions

export const defaultInitState: SessionState = {
  userId: undefined,
  role: undefined,
}

export const createSessionStore = (
  initState: SessionState = defaultInitState,
) => {
  return createStore<SessionStore>()((set) => ({
    ...initState,
    setUser: (userId: number | undefined, role: string | undefined) => set(() => ({ userId, role})),
    clearUser: () => set(() => ({ userId: undefined, role: undefined, session: undefined })),
  }));
}
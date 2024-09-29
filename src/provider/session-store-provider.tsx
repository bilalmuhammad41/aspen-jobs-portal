"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type SessionStore,
  createSessionStore,
  defaultInitState,
} from "@/stores/session-store"; // Import the session store

export type SessionStoreApi = ReturnType<typeof createSessionStore>;

export const SessionStoreContext = createContext<SessionStoreApi | undefined>(
  undefined
);

export interface SessionStoreProviderProps {
  children: ReactNode;
}

export const SessionStoreProvider = ({
  children,
}: SessionStoreProviderProps) => {
  const storeRef = useRef<SessionStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createSessionStore(defaultInitState); // Initialize session store with default state
  }

  return (
    <SessionStoreContext.Provider value={storeRef.current}>
      {children}
    </SessionStoreContext.Provider>
  );
};

// Custom hook to use the session store
export const useSessionStore = <T,>(
  selector: (store: SessionStore) => T
): T => {
  const sessionStoreContext = useContext(SessionStoreContext);

  if (!sessionStoreContext) {
    throw new Error(`useSessionStore must be used within SessionStoreProvider`);
  }

  return useStore(sessionStoreContext, selector);
};

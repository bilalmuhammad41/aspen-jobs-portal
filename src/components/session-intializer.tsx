"use client";

import { useEffect } from "react";
import { useSessionStore } from "@/provider/session-store-provider";
import { getSession } from "@/app/lib/session";

const SessionInitializer = () => {
  const setUser = useSessionStore((state) => state.setUser);

  useEffect(() => {
    const initializeSession = async () => {
      const session = await getSession();
      setUser(session?.userId, session?.role);
    };
    initializeSession();
  }, [setUser]);

  return null;
};

export default SessionInitializer;
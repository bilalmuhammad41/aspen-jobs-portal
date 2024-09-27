import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/app/lib/session";
import { cache } from "react";
import { redirect } from "next/navigation";
import prisma from "./prisma";

export const verifySession = cache(async () => {
  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);
  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: session.userId };
});

export const getUser = cache(async () => {
  const session = await verifySession();

  if (!session) return null;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.userId ? Number(session.userId) : undefined,
      },
    });

    return user;
  } catch (error) {
    console.log("Failed to fetch user");
    return null;
  }
});

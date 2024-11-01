"use server";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SessionPayload } from "@/app/lib/definitions";
import prisma from "../lib/prisma";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

async function decrypt(
  session: string | undefined = ""
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (error) {
    console.log("Failed to verify session");
    return null;
  }
}

export async function createSessionAction(userId: number) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const newSession = await prisma.session.create({
    data: {
      userId,
      expiresAt,
    },
  });

  const sessionId = newSession.id;
  const user = await prisma.user.findFirst({
    where: { id: newSession.userId },
  });
  const session = await encrypt({
    name: user?.name as string,
    userId: user?.id as number,
    role: user?.role as string,
    sessionId,
    expiresAt,
  });

  
  cookies().set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSessionAction() {
  const session = cookies().get("session")?.value;
  const payload = await decrypt(session);
  
  if (!session || !payload) {
    return null;
  }
  
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  cookies().set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSessionAction() {
  const session = cookies().get("session")?.value;
  const data = await decrypt(session);
  return data;
}

export async function deleteSessionAction() {
  cookies().delete("session");
}
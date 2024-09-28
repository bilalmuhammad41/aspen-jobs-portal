import { SessionPayload } from "@/app/lib/definitions";
import { createSessionAction, updateSessionAction, getSessionAction, deleteSessionAction } from "@/app/actions/session";

export async function createSession(userId: number) {
  return createSessionAction(userId);
}

export async function updateSession() {
  return updateSessionAction();
}

export async function getSession(): Promise<SessionPayload | null> {
  return getSessionAction();
}

export function deleteSession() {
  return deleteSessionAction();
}

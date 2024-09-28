import { getAllUsers } from "@/app/actions/user";
import { NextResponse } from "next/server";

export async function GET() {
  const users = await getAllUsers();
  return NextResponse.json(users);
}

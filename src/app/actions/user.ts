import { GetAllUsersApiResponse } from "../lib/definitions";
import prisma from "../lib/prisma";

export async function getAllUsers(): Promise<GetAllUsersApiResponse> {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
    },
  });
  return {
    message: "Success",
    data: users,
  };
}

"use server";

import bcrypt from "bcryptjs";
import {
  SignupFormSchema,
  LoginFormSchema,
  FormState,
} from "@/app/lib/definitions";
import prisma from "../lib/prisma";
import { createSession, deleteSession } from "../lib/session";
import { Role } from "@prisma/client";

export async function signup(state: FormState, formData: FormData) {
  console.log(formData);

  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData?.get("name"),
    email: formData?.get("email"),
    password: formData?.get("password"),
  });
  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return {
        errors: { email: ["Email already exists"] },
      };
    }
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    await createSession(newUser.id);
    return { success: true };
  } catch (error) {
    console.log(error);
    return {
      errors: { server: ["An error occurred during signup"] },
    };
  }
}

export async function login(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData?.get("email"),
    password: formData?.get("password"),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        errors: { email: ["Invalid email or password"] },
      };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return {
        errors: { password: ["Invalid email or password"] },
      };
    }

    await createSession(user.id);
    return { success: true };
  } catch (error) {
    console.log(error);
    return {
      errors: { server: ["An error occurred during login"] },
    };
  }
}

export async function logout() {
  deleteSession();
  return { success: true };
}

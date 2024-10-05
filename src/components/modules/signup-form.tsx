"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signup } from "@/app/actions/auth";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Label } from "../ui/label";

interface SignupState {
  success?: boolean;
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    server?: string[];
  };
}

function SubmitButton() {
  const { pending } = useFormStatus();
  
  console.log("SubmitButton - Pending state:", pending);

  return (
    <Button type="submit" disabled={pending} className="relative">
      {pending && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {pending ? "Signing up..." : "Signup"}
    </Button>
  );
}

export default function SignupForm() {
  const [state, formAction] = useFormState<SignupState, FormData>(signup, { errors: {} });

  console.log("SignupForm - Current state:", state);

  if (state?.success) {
    console.log("SignupForm - Signup successful, redirecting to dashboard");
    redirect("/dashboard");
  }

  const handleSubmit = async (formData: FormData) => {
    console.log("SignupForm - Form submitted");
    try {
      await formAction(formData);
    } catch (error) {
      console.error("SignupForm - Error during form submission:", error);
    }
  };

  return (
    <div>
      <Card className="md:w-[400px] w-[360px]">
        <CardHeader className="text-2xl font-bold">Signup</CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form className="flex flex-col gap-4" action={handleSubmit}>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input placeholder="Name" id="name" name="name" type="text" required />
              {state.errors?.name && <p className="text-sm text-red-500">{state.errors.name[0]}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="example@gmail.com"
              />
              {state.errors?.email && (
                <p className="text-sm text-red-500">{state.errors.email[0]}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input placeholder="********" id="password" name="password" type="password" required />
              {state.errors?.password && (
                <p className="text-sm text-red-500">{state.errors.password[0]}</p>
              )}
            </div>

            {state.errors?.server && (
              <p className="text-sm text-red-500">{state.errors.server[0]}</p>
            )}

            <SubmitButton />
          </form>
          <div className="flex flex-no-wrap w-full gap-4 py-5 items-center">
            <div className="h-[1px] bg-gray-400 flex-1 "></div>
            <p className="self-center text-[14px] text-gray-400">
             Already a member?
            </p>
            <div className="h-[1px] bg-gray-400 flex-1"></div>
          </div>
          <Link href="/login" className="w-full">
            <Button className="w-full border-gray-400" variant="outline">
              Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

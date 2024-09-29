"use client";
import { useFormState, useFormStatus } from "react-dom";
import { signup } from "@/app/actions/auth";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { LoaderCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default function SignupForm() {
  const [state, action] = useFormState(signup, undefined);
  if (state?.success) {
    redirect("/dashboard");
  }
  const { pending } = useFormStatus();
  return (
    <div>
      <Card className="w-[400px]">
        <CardHeader className="text-2xl font-bold">Signup</CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form className="flex flex-col gap-4" action={action}>
            <label htmlFor="name">Name</label>
            <Input id="name" name="name" type="text" />
            {state?.errors?.name && <p>{state.errors.name}</p>}

            <label htmlFor="email">Email</label>
            <Input id="email" name="email" type="email" />
            {state?.errors?.email && <p>{state.errors.email}</p>}

            <label htmlFor="password">Password</label>
            <Input id="password" name="password" type="password" />
            {state?.errors?.password && (
              <div>
                <p>Password must:</p>
                <ul>
                  {state.errors.password.map((error) => (
                    <li key={error}>- {error}</li>
                  ))}
                </ul>
              </div>
            )}
            <Button type="submit">
              {pending ? (
                <LoaderCircle className="w-4 h-4 spinner" />
              ) : (
                "Signup"
              )}
            </Button>
          </form>
          <p>
            Already a member? <Link href="/login">Login</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

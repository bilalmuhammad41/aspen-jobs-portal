"use client";
import { useFormState, useFormStatus } from "react-dom";
import { signup } from "@/app/actions/auth";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { LoaderCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { Label } from "../ui/label";

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
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" type="text" />
              {state?.errors && "name" in state.errors && state.errors.name && <p>{state.errors.name}</p>}
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
              {state?.errors &&
                "email" in state.errors &&
                state.errors.email && (
                  <p className="text-sm text-red-500">
                    {state.errors.email[0]}
                  </p>
                )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
              {state?.errors &&
                "password" in state.errors &&
                state.errors.password && (
                  <p className="text-sm text-red-500">
                    {state.errors.password[0]}
                  </p>
                )}
            </div>
            <Button type="submit">
              {pending ? (
                <LoaderCircle className="w-4 h-4 spinner" />
              ) : (
                "Signup"
              )}
            </Button>
          </form>
          <div className="flex flex-no-wrap w-full gap-4 py-5 items-center">
            <div className="h-[1px] bg-gray-400 flex-1 "></div>
            <p className="self-center text-[14px] text-gray-400">
             Already a member?
            </p>
            <div className="h-[1px] bg-gray-400 flex-1"></div>
          </div>
            <Link href="/login" className="w-full"><Button className="w-full border-gray-400" variant="outline">Login</Button></Link>
        </CardContent>
      </Card>
    </div>
  );
}

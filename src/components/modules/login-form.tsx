"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { login } from "@/app/actions/auth";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { LoaderCircle } from "lucide-react";
export default function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(login, undefined);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state?.success) {
      router.push("/dashboard");
    }
  }, [state, router]);

  return (
    <div>
      <Card className="w-[400px]">
        <CardHeader className="text-2xl font-bold">Login</CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form action={formAction} className="flex flex-col gap-4">
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

            {state?.errors &&
              "server" in state.errors &&
              state.errors.server && (
                <p className="text-sm text-red-500">{state.errors.server[0]}</p>
              )}

            <Button type="submit" disabled={pending}>
              {pending ? <LoaderCircle className="w-4 h-4 spinner" /> : "Login"}
            </Button>
          </form>
          <div className="flex flex-no-wrap w-full gap-4 items-center py-5">
            <div className="h-[1px] bg-gray-400 flex-1"></div>
            <p className="self-center text-[14px] text-gray-400">
              Don&apos;t have an account?
            </p>
            <div className="h-[1px] bg-gray-400 flex-1"></div>
          </div>
          <Link href="/signup" className="w-full"><Button className="w-full border-gray-500" variant="outline">Signup</Button></Link>

        </CardContent>
      </Card>
    </div>
  );
}

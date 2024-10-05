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
import { Loader2 } from "lucide-react";

interface LoginState {
  success?: boolean;
  errors?: {
    email?: string[];
    password?: string[];
    server?: string[];
  };
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="relative">
      {pending && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {pending ? "Logging in..." : "Login"}
    </Button>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useFormState<LoginState, FormData>(login, { errors: {} });

  useEffect(() => {
    console.log("LoginForm - Current state:", state);
    if (state?.success) {
      console.log("LoginForm - Login successful, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [state, router]);

  const handleSubmit = (formData: FormData) => {
    console.log("LoginForm - Form submitted");
    formAction(formData);
  };

  return (
    <div>
      <Card className="md:w-[400px] w-[360px]">
        <CardHeader className="text-2xl font-bold">Login</CardHeader>
        <CardContent className="flex flex-col gap-4">
          <form action={handleSubmit} className="flex flex-col gap-4">
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
          <div className="flex flex-no-wrap w-full gap-4 items-center py-5">
            <div className="h-[1px] bg-gray-400 flex-1"></div>
            <p className="self-center text-[14px] text-gray-400">
              Don&apos;t have an account?
            </p>
            <div className="h-[1px] bg-gray-400 flex-1"></div>
          </div>
          <Link href="/signup" className="w-full">
            <Button className="w-full border-gray-500" variant="outline">
              Signup
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

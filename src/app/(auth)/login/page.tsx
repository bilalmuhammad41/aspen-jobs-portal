"use client";

import { useEffect } from "react";
import LoginForm from "@/components/modules/login-form";

export default function LoginPage() {
  useEffect(() => {
    console.log("Login page mounted");
  }, []);

  return <LoginForm />;
}

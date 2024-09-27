import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/app/lib/session";
import { cookies } from "next/headers";

// Specify protected and public routes
const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Decrypt the session from the cookie
  const cookie = cookies().get("session")?.value;
  const session = cookie ? await decrypt(cookie) : null;

  // Check if the user is authenticated
  const isAuthenticated = !!session?.userId;

  // Redirect to /login if trying to access protected routes without authentication
  if (protectedRoutes.includes(path) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect authenticated users away from public routes to dashboard
  if (publicRoutes.includes(path) && isAuthenticated) {
    const redirectUrl =
      session?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user";
    return NextResponse.redirect(new URL(redirectUrl, req.nextUrl));
  }

  // If at /dashboard, redirect based on role
  if (path === "/dashboard") {
    const redirectUrl =
      session?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user";
    return NextResponse.redirect(new URL(redirectUrl, req.nextUrl));
  }

  // Prevent ADMIN from accessing /dashboard/user and USER from accessing /dashboard/admin
  if (path.startsWith("/dashboard/admin") && session?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard/user", req.nextUrl));
  }
  if (path.startsWith("/dashboard/user") && session?.role === "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard/admin", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

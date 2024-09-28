import { NextRequest, NextResponse } from "next/server";
import { getSessionAction } from "@/app/actions/session";

// Specify protected and public routes as regular expressions
const protectedRoutes = [
  /^\/dashboard(\/.*)?$/,
  /^\/dashboard\/admin(\/.*)?$/,
  /^\/dashboard\/user(\/.*)?$/,
];
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Get the session using the server action
  const session = await getSessionAction();

  // Check if the user is authenticated
  const isAuthenticated = !!session?.userId;

  // Check if the path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => route.test(path));

  // Redirect to /login if trying to access protected routes without authentication
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect authenticated users away from public routes to dashboard
  if (publicRoutes.includes(path) && isAuthenticated) {
    const redirectUrl =
      session?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user";
    return NextResponse.redirect(new URL(redirectUrl, req.nextUrl));
  }

  // If at /dashboard, redirect based on role
  if (
    path === "/dashboard" ||
    path === "/dashboard/admin" ||
    path === "/dashboard/user"
  ) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    const redirectUrl =
      session?.role === "ADMIN"
        ? "/dashboard/admin/home"
        : "/dashboard/user/jobs";
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

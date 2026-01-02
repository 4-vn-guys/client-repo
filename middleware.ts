import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Simple middleware for protecting routes
 * Checks if user has auth token in localStorage (client-side will handle this)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ["/owner"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Auth pages that should redirect if already logged in
  const authPages = ["/login", "/register"];
  const isAuthPage = authPages.includes(pathname);

  // For client-side routing, we'll let the app handle auth checks
  // This is a basic implementation - the real auth check happens in useAuth hook
  
  return NextResponse.next();
}

// Configure which routes should use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};

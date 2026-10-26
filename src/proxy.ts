import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "pow_session";

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET || "pavishna-dev-secret-super-secure-at-least-32-chars-long";
  return new TextEncoder().encode(secret);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle /admin routes
  if (pathname.startsWith("/admin")) {
    // Allow public access to admin login page
    if (pathname === "/admin/login") {
      const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
      if (token) {
        try {
          const { payload } = await jwtVerify(token, getSecretKey());
          if (payload.role === "ADMIN" || payload.role === "STAFF") {
            return NextResponse.redirect(new URL("/admin/dashboard", request.url));
          }
        } catch {
          // Token invalid; stay on login page
        }
      }
      return NextResponse.next();
    }

    // Protect all other /admin routes
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, getSecretKey());
      if (payload.role !== "ADMIN" && payload.role !== "STAFF") {
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.next();
    } catch {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Handle /account customer routes
  if (pathname.startsWith("/account")) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      await jwtVerify(token, getSecretKey());
      return NextResponse.next();
    } catch {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};

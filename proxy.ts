import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const LOGIN_PATH = "/admin/login";

function safeAdminPath(pathname: string) {
  if (pathname === "/admin" || pathname === LOGIN_PATH) {
    return null;
  }

  if (!pathname.startsWith("/admin/")) {
    return null;
  }

  return pathname;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    const from = safeAdminPath(pathname);

    if (from) {
      loginUrl.searchParams.set("from", from);
    }

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

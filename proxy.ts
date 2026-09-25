import { NextRequest, NextResponse } from "next/server";

const LOGIN_PATH = "/admin/login";
const SESSION_COOKIE = "admin_session";

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

  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;

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

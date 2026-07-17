import { NextRequest, NextResponse } from "next/server";
import { readSessionFromCookieValue, COOKIE_NAME } from "@/lib/session";

const LOGIN_PATH = "/admin/login";

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const { isAuth } = await readSessionFromCookieValue(req.cookies.get(COOKIE_NAME)?.value);

  if (pathname === LOGIN_PATH) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!isAuth) {
    return NextResponse.redirect(new URL(LOGIN_PATH, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

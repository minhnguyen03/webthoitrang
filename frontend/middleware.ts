import { NextRequest, NextResponse } from "next/server";

const infoAliases = new Set(["/about", "/contact", "/stores", "/careers", "/shipping", "/returns", "/payment", "/faq"]);

const authAliases: Record<string, string> = {
  "/auth/login": "/login",
  "/auth/register": "/register",
  "/auth/forgot-password": "/forgot-password",
  "/auth/reset-password": "/reset-password",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (infoAliases.has(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `/info${pathname}`;
    return NextResponse.redirect(url);
  }

  const authTarget = authAliases[pathname];
  if (authTarget) {
    const url = request.nextUrl.clone();
    url.pathname = authTarget;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/about",
    "/contact",
    "/stores",
    "/careers",
    "/shipping",
    "/returns",
    "/payment",
    "/faq",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
  ],
};

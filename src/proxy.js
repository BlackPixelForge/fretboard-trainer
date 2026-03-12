import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getAuthLimiter } from "@/lib/ratelimit";

const STATIC_ASSET_RE =
  /\.(?:ico|png|jpg|jpeg|svg|gif|css|js|woff2?|ttf|map)$/i;

export default auth(async (req) => {
  const { pathname } = req.nextUrl;

  // Public routes — always accessible
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/api/auth") ||
    pathname === "/api/webhook" ||
    pathname.startsWith("/_next") ||
    STATIC_ASSET_RE.test(pathname)
  ) {
    // Rate limit magic link sign-in and callback
    if (
      pathname === "/api/auth/signin" ||
      pathname.startsWith("/api/auth/callback/resend")
    ) {
      const ip = req.headers.get("x-forwarded-for") ?? "unknown";
      const { success } = await getAuthLimiter().limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests" },
          { status: 429 }
        );
      }
    }

    return NextResponse.next();
  }

  // Everything under /app and /api (except auth/webhook) requires auth
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

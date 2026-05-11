import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/api/webhooks(.*)",
]);

const isAuthPageRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

/** Dev-only: Postman can call /api/* with x-postman-secret (see lib/server/dev-postman-bypass.ts). */
function isDevPostmanApiBypass(request: NextRequest): boolean {
  if (process.env.NODE_ENV !== "development") {
    return false;
  }
  const key = process.env.DEV_POSTMAN_API_KEY;
  if (!key || key.length < 32) {
    return false;
  }
  if (!request.nextUrl.pathname.startsWith("/api")) {
    return false;
  }
  return request.headers.get("x-postman-secret") === key;
}

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  if (userId && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (userId && isAuthPageRoute(request)) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (!isPublicRoute(request) && isDevPostmanApiBypass(request)) {
    return NextResponse.next();
  }

  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

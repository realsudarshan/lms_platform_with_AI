import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/', '/pricing', '/sign-in(.*)', '/sign-up(.*)']);
const isStudioRoute = createRouteMatcher(['/studio(.*)']);

const clerkProxy = clerkMiddleware(async (auth, request) => {
  // 1. Protect the Studio route with an Admin check (using Metadata)
  if (isStudioRoute(request)) {
    const { sessionClaims } = await auth();

    // Accessing role from publicMetadata
    // Note: You must add "public_metadata" to your Session Token in Clerk Dashboard
    const role = (sessionClaims?.metadata as { role?: string })?.role;

    if (role !== 'admin') {
      const url = new URL('/', request.url);
      return NextResponse.redirect(url);
    }
  }

  // 2. Protect all other non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export { clerkProxy as proxy };
export default clerkProxy;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
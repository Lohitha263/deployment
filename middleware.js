// middleware.js
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/forum(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth.protect(); // no auth() and no req.cookies.get manually
  }
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // all routes except static files
    "/",                      // home page
    "/(api|trpc)(.*)",        // API routes
  ],
};

import nextAuthMiddleware from "next-auth/middleware";

export default nextAuthMiddleware;

export const config = {
  // Only protect dashboard routes with middleware.
  // Public login routes such as /login and /investigator-login are intentionally excluded.
  matcher: ["/dashboard/:path*"],
};
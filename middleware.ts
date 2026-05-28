import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/product/(.*)", "/api/webhook"]
});

export const config = {
  matcher: ["/((?!.+\.[\w]+$|_next).*)", "/(api|trpc)(.*)"],
};

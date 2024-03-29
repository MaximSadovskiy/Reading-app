import NextAuth from "next-auth";
import authConfig from "auth.config";
import {
    apiAuthPrefix,
    apiBooksPrefix,
    authRoutes,
    publicRoutes
} from '@/routes';

const { auth } = NextAuth(authConfig);

const bookIdRegex = /^\/books\/\d+$/;
const readRegex = /^\/read\/\d+$/;

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isApiBooksRoute = nextUrl.pathname.startsWith(apiBooksPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname) || bookIdRegex.test(nextUrl.pathname) || readRegex.test(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    /* return; */
    if (isApiAuthRoute || isPublicRoute || isAuthRoute || isApiBooksRoute) {
        return;
    }

    // if user on PRIVATE route & not logged in
    if (!isLoggedIn) {
        return Response.redirect(new URL('/auth/login', nextUrl));
    }
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
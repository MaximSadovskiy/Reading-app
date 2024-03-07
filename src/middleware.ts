import NextAuth from "next-auth";
import authConfig from "auth.config";
import {
    apiAuthPrefix,
    authRoutes,
    publicRoutes
} from '@/routes';

const { auth } = NextAuth(authConfig);

const bookIdRegex = /^\/books\/\d+$/;
const readRegex = /^\/read\/\d+$/;

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    console.log('Route is: ', nextUrl.pathname);
    console.log('is tested by reg: ', readRegex.test(nextUrl.pathname));

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname) || bookIdRegex.test(nextUrl.pathname) || readRegex.test(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    /* return; */
    if (isApiAuthRoute || isPublicRoute || isAuthRoute) {
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
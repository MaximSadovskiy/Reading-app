import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "auth.config";
import db from "@/lib/db";
import { getUserById } from "@/lib/db_helpers";
import { UserRole } from "@prisma/client";

// types for excluding mistakes in CALLBACKs 
type ExtendedUser = DefaultSession['user'] & {
	role: UserRole;
}

declare module "next-auth" {
	interface Session {
		user: ExtendedUser
	}
}


export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	callbacks: {
		// 			SIGN IN
		/* async signIn({ user }) {
			const existingUser = await getUserById(user.id as string);
			
			// temp
			if (!existingUser || !existingUser.emailVerified) {
				return false;
			}

			return true;
		}, */
		async session({ session, token }) {
			// token.sub === user.id
			if (session.user && token.sub) {
				session.user.id = token.sub;
			}

			if (token.role && session.user) {
				session.user.role = token.role as UserRole;
			}

			return session;
		},
		async jwt({ token }) {
			// logged out user
			if (!token.sub) return token;

			// token.sub === user.id
			const existingUser = await getUserById(token.sub);
			if (!existingUser) return token;

			token.role = existingUser.role;
			
			return token;
		},
	},
	adapter: PrismaAdapter(db),
	session: { strategy: 'jwt' },
	...authConfig,
});
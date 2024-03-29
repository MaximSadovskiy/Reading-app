import NextAuth, { DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "auth.config";
import db from "@/database/db";
import { getUserById } from "@/database/db_helpers";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserID } from "@/database/db_helpers";

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
	trustHost: true,
	pages: {
		signIn: "/auth/login",
	},
	events: {
		// oAuth users automatically verified emails
		async linkAccount({ user }) {
			await db.user.update({
				where: {
					id: user.id,
				},
				data: { emailVerified: new Date() }
			})
		},
	},
	callbacks: {
		async signIn({ user, account }) {
			// allow OAuth without email verification
			if (account?.provider !== 'credentials') return true;
			
			const existingUser = await getUserById(user.id as string);
			// block users that do not verified email yet
			if (!existingUser?.emailVerified) return false;

			// Two-Factor-Auth check
			if (existingUser.isTwoFactorEnabled) {
				const twoFactorConfirmation = await getTwoFactorConfirmationByUserID(existingUser.id);

				if (!twoFactorConfirmation) return false;

				// delete confirmation for next signIn
				await db.twoFactorConfirmation.delete({
					where: { id: twoFactorConfirmation.id }
				});
			}

			return true;
		},
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
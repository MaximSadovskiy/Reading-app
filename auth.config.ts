import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { LoginSchema } from "@/schemas/zod/loginSchemas";
import { getUserByEmail } from "@/database/db_helpers";
import bcrypt from "bcryptjs";

export const runtime = 'nodejs';

export default {
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		}),
		Credentials({
			async authorize(credentials) {

				const validatedFields = LoginSchema.safeParse(credentials);

				if (validatedFields.success) {
					const { email, password } = validatedFields.data;

					const user = await getUserByEmail(email);

					/* no user found OR user doesnt have password (reg with provider) */
					if (!user || !user.password) {
						return null;
					}

					const isPasswordsMatch = await bcrypt.compare(password, user.password);

					if (isPasswordsMatch) return user;
					else return null;
				}

				return null;
			}
		})
	],
} satisfies NextAuthConfig
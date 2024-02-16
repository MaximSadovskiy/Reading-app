import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import VK from "next-auth/providers/vk";
import Yandex from "next-auth/providers/yandex";
import { LoginSchema } from "@/schemas/zod/loginSchemas";
import { getUserByEmail } from "@/lib/db_helpers";
import bcrypt from "bcryptjs";


export default {
	providers: [
		VK,
		Yandex({
			clientId: process.env.YANDEX_CLIENT_ID,
			clientSecret: process.env.YANDEX_CLIENT_SECRET,
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
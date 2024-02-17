'use server';
import { z } from 'zod';
import { RegisterSchema, LoginSchema } from '@/schemas/zod/loginSchemas';
import db from "@/lib/db";
import { getUserByEmail } from '@/lib/db_helpers';
import bcrypt from "bcryptjs";
import { signIn } from '$/auth';
import { AuthError } from 'next-auth';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

enum ErrorMessages {
    EMAIL_ALREADY_EXISTS = 'Ошибка: Пользователь с таким адресом электронной почты уже существует',
    // test
    EMAIL_DOESNT_EXISTS = 'Ошибка: Пользователя с таким адресом электронной почты не существует',
    EMAIL_DOESNT_VERIFIED = 'Ошибка: Ваша электронная почта не подтверждена, пожалуйста подтвердите',
    INVALID_DATA = 'Допущены ошибки при заполнении данных',
    OTHER = 'Что-то пошло не так...',
}

enum SuccessMessages {
    REGISTER = 'Регистрация завершена успешно, подтверждение отправлено на указанный email',
    LOGIN = 'Вход в аккаунт выполнен успешно!',
}

export const registerAction = async (data: z.infer<typeof RegisterSchema>) => {

    // validation
    const validatedFields = RegisterSchema.safeParse(data);

    // error: validation 
    if (!validatedFields.success) {
        return {
            error: {
                type: 'form',
                message: ErrorMessages.INVALID_DATA,
            }
        };
    }

    // password hashing
    const { username, email, password, favouriteGenres } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await getUserByEmail(email);
    // error: already exists
    if (existingUser) {
        return {
            error: {
                type: 'email',
                message: ErrorMessages.EMAIL_ALREADY_EXISTS,
            }
        }
    }

    // creating new unique user
    await db.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            favouriteGenres
        }
    });

    // Create & Send verification token on email
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
    );

    return { success: SuccessMessages.REGISTER};
};


export const loginAction = async (data: z.infer<typeof LoginSchema>) => {

    // validation
    const validatedFields = LoginSchema.safeParse(data);

    // error: validation 
    if (!validatedFields.success) {
        return { error: ErrorMessages.INVALID_DATA };
    }

    const { username, email, password, confirmPassword } = validatedFields.data;

    // new: Check if Email Verified
    const existingUser = await getUserByEmail(email);

    // email doesn't exist - TEST
    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: ErrorMessages.EMAIL_DOESNT_EXISTS};
    }

    if (!existingUser?.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );
        // break function, return message
        return { error: ErrorMessages.EMAIL_DOESNT_VERIFIED };
    }

    try {
        await signIn("credentials", {
            username,
            email,
            password,
            confirmPassword,
        });

        return { success: SuccessMessages.LOGIN };
    } catch (error) {

        if (error instanceof AuthError) {

            switch (error.type) {
                case 'CredentialsSignin': {
                    return { error: ErrorMessages.INVALID_DATA }
                }
                default: {
                    return { error: ErrorMessages.OTHER }
                }
            }
        }

        throw error;
    }
};

/* PROVIDERS login (google, etc.) */

type ProviderNames = 'google';

export const providerSubmitAction = async (providerName: ProviderNames) => {
    try {
        await signIn(providerName);
        return { success: true }
    } catch (error) {
        return { error: true }
    }
};
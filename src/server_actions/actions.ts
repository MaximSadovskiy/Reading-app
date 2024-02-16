'use server';
import { z } from 'zod';
import { RegisterSchema, LoginSchema } from '@/schemas/zod/loginSchemas';
import db from "@/lib/db";
import { getUserByEmail } from '@/lib/db_helpers';
import bcrypt from "bcryptjs";
import { signIn } from '$/auth';
import { AuthError } from 'next-auth';

enum RegisterErrors {
    EMAIL = 'Пользователь с таким адресом электронной почты уже существует',
    FORM = 'FORM_DATA_MISTAKES',
}

export const registerAction = async (data: z.infer<typeof RegisterSchema>) => {

    // validation
    const validatedFields = RegisterSchema.safeParse(data);

    // error: validation 
    if (!validatedFields.success) {
        return { error: {
            type: 'form',
            message: RegisterErrors.FORM,
        } };
    }

    // password hashing
    const { username, email, password, favouriteGenres } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await getUserByEmail(email);
    // error: already exists
    if (existingUser) {
        return { error: {
            type: 'email',
            message: RegisterErrors.EMAIL,
        }}
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

    // TODO: send verification token email

    return { success: 'Ваш аккаунт успешно зарегистрирован!' };
};


export const loginAction = async (data: z.infer<typeof LoginSchema>) => {

    // validation
    const validatedFields = LoginSchema.safeParse(data);

    // error: validation 
    if (!validatedFields.success) {
        return { error: 'Ошибка при заполнении данных' };
    }

    const { username, email, password, confirmPassword } = validatedFields.data;

    try {
        await signIn("credentials", {
            username,
            email, 
            password,
            confirmPassword,
        });

        // mb delete OR dont redirect above
        return { success: "Вход выполнен успешно!" }
    } catch (error) {

        if (error instanceof AuthError) {

            switch (error.type) {
                case 'CredentialsSignin': {
                    return { error: "Введены ошибочные данные для входа, попробуйте снова"}
                }
                default: {
                    return { error: "Что-то пошло не так..." }
                }    
            }
        }

        throw error;
    }
};
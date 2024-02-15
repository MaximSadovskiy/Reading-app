'use server';
import { z } from 'zod';
import { RegisterSchema, LoginSchema } from '@/schemas/zod/loginSchemas';
import db from "@/lib/db";
import { getUserByEmail } from '@/lib/db_helpers';
import bcrypt from "bcryptjs";


export const registerAction = async (data: z.infer<typeof RegisterSchema>) => {

    // validation
    const validatedFields = RegisterSchema.safeParse(data);
    console.log(validatedFields);
    await new Promise(res => setTimeout(res, 2000));

    // error: validation 
    if (!validatedFields.success) {
        return { error: 'Ошибка при заполнении формы' };
    }

    // password hashing
    const { username, email, password, favouriteGenres } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await getUserByEmail(email);
    // error: already exists
    if (existingUser) {
        return { error: 'Пользователь с таким адресом электронной почты уже существует'}
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
    console.log(validatedFields);
    await new Promise(res => setTimeout(res, 2000));

    // error: validation 
    if (!validatedFields.success) {
        return { error: 'Ошибка при заполнении формы' };
    }

    // error: already exists
    return { success: 'Вход в аккаунт выполнен!' };
};
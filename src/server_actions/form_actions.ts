'use server';
import { z } from 'zod';
import { RegisterSchema, LoginSchema, ResetSchema, NewPasswordSchema } from '@/schemas/zod/loginSchemas';
import db from "@/lib/db";
import { getPasswordResetTokenByToken, getTwoFactorConfirmationByUserID, getTwoFactorTokenByEmail, getUserByEmail, getVerificationTokenByToken } from '@/lib/db_helpers';
import bcrypt from "bcryptjs";
import { signIn, signOut } from '$/auth';
import { AuthError } from 'next-auth';
import { 
    generateVerificationToken, 
    generatePasswordResetToken, 
    generateTwoFactorToken 
} from '@/lib/tokens';
import { sendVerificationEmail, 
    sendPasswordResetToken, 
    sendTwoFactorTokenEmail 
} from '@/lib/mail';
import { ErrorMessages, SuccessMessages, LoginSuccessTypes } from '@/interfaces/formMessages';


// REGISTER
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

    return { success: SuccessMessages.REGISTER_SUCCESS };
};


// LOGIN
export const loginAction = async (data: z.infer<typeof LoginSchema>) => {

    // validation
    const validatedFields = LoginSchema.safeParse(data);

    // error: validation 
    if (!validatedFields.success) {
        return { error: ErrorMessages.INVALID_DATA };
    }

    const { username, email, password, confirmPassword, code } = validatedFields.data;

    // new: Check if Email Verified
    const existingUser = await getUserByEmail(email);

    // email doesn't exist - TEST
    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: ErrorMessages.EMAIL_DOESNT_EXISTS };
    }

    // If email doesn't verified yet
    if (!existingUser?.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token,
        );
        // send message
        return { success: { 
            type: LoginSuccessTypes.EMAIL_SENT,
            message: SuccessMessages.EMAIL_SENT,
        } };
    }

    // Two-Factor verification
    if (existingUser.isTwoFactorEnabled && existingUser.email) {
        // user gets token on email and enter it through client
        if (code) {
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
            // code was not found by email
            if (!twoFactorToken) {
                return { error: ErrorMessages.TOKEN_WASNT_FOUND_BY_EMAIL }
            }

            // token !== user entered code
            if (twoFactorToken.token !== code) {
                return { error: ErrorMessages.TOKEN_INVALID }
            }

            // token expired
            const hasExpired = new Date(twoFactorToken.expires) < new Date();
            if (hasExpired) {
                return { error: ErrorMessages.TOKEN_EXPIRED }
            }

            // SUCCESS
            // remove token + add confirmation to user
            await db.twoFactorToken.delete({
                where: { id: twoFactorToken.id },
            });

            // delete confirmation if somehow exists
            const existingConfirmation = await getTwoFactorConfirmationByUserID(
                existingUser.id,
            );
            if (existingConfirmation) {
                await db.twoFactorConfirmation.delete({
                    where: { id: existingConfirmation.id },
                });
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id,
                }
            });
        }

        // firstly, token created (bounded with user email) & sended to user
        else {
            const twoFactorToken = await generateTwoFactorToken(email);
            await sendTwoFactorTokenEmail(
                twoFactorToken.email,
                twoFactorToken.token,
            );
            
            // Промежуточный успех: token sended
            return { success: {
                type: LoginSuccessTypes.TWO_FACTOR,
                message: SuccessMessages.TWO_FACTOR,
            } };
        }
    }

    try {

        await signIn('credentials', {
            username,
            email,
            password,
            confirmPassword,
            redirect: false,
        });

        // COMPLETE SUCCESS ON LOGING IN USER
        return { success: {
            type: LoginSuccessTypes.LOGIN_SUCCESS,
            message: SuccessMessages.LOGIN_SUCCESS,
        } };
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


/* VERIFICATION */
export const newVerificationAction = async (token: string) => {
    // если токена нет
    const existingToken = await getVerificationTokenByToken(token);
    if (!existingToken) {

        return { error: 'Ошибка: токен не существует, вход невозможен, перейдите на страницу для регистрации' };
    }

    // если истёк срок токена
    const isExpired = new Date(existingToken.expires) < new Date();
    if (isExpired) {

        return { error: 'Ошибка: срок вашего токена истёк, необходимо повторно войти в аккаунт' };
    }

    // если пользователь сменил email
    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {

        return { error: 'Ошибка: пользователь с данным email не найден, если вы изменили email - пройдите регистрацию повторно' };
    }

    // EMAIL VERIFIED SUCCESS
    await db.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
            // 4:36:00
            // если пользователь захочет изменить email после регистрации
            email: existingUser.email,
        }
    });

    // Remove verification token
    await db.verificationToken.delete({
        where: { id: existingToken.id }
    });


    return { success: 'Email успешно подтверждён!' };
};


// RESET (FORGOT) PASSWORD
export const forgotPasswordAction = async (values: z.infer<typeof ResetSchema>) => {

    // validation
    const validatedFields = ResetSchema.safeParse(values);
    // error: validation 
    if (!validatedFields.success) {
        return { error: ErrorMessages.INVALID_DATA };
    }
    // extracting email
    const { email } = validatedFields.data;


    const existingUser = await getUserByEmail(email);
    // no user found
    if (!existingUser) {
        return { error: 'Ошибка: Пользователя с таким email не найдено' };
    }

    // generate & send token
    const passwordResetToken = await generatePasswordResetToken(email);

    await sendPasswordResetToken(
        passwordResetToken.email,
        passwordResetToken.token,
    );

    return { success: 'Письмо с подтверждением отправлено на указанный email' };
};


// NEW PASSWORD
export const newPasswordAction = async (values: z.infer<typeof NewPasswordSchema>, token?: string) => {
    // если нет токена
    if (!token) {
        return { error: 'Токен отсутствует, продолжение действия невозможно' };
    }

    const validatedFields = NewPasswordSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: 'Некорректное заполнение данных' };
    }

    // find existing token by token
    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken) {
        return { error: 'Совпадающего токена не найдена, продолжение невозможно, советуем повторить операцию по смене пароля' };
    }

    // if expired
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
        return { error: 'Срок действия токена вышел, продолжение невозможно, советуем повторить операцию по смене пароля' };
    }

    // existing USER
    const existingUser = await getUserByEmail(existingToken.email);
    if (!existingUser) {
        return { error: 'Существующий пользователь не найден, продолжение невозможно, советуем повторить операцию по смене пароля' };
    }

    const { password } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
        where: { id: existingUser.id },
        data: {
            password: hashedPassword,
        }
    });

    // delete token
    await db.passwordResetToken.delete({
        where: { id: existingToken.id }
    });

    return { success: 'Пароль был успешно изменён!' };
}
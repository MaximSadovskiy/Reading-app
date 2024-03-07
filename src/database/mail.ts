import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const DOMAIN_URL = process.env.DOMAIN_URL;

// will be changed on Production

// email-Verification token
export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${DOMAIN_URL}/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Подтверждение email-адреса на БукЛайф',
        // mb change to react later
        html: `<p>Перейдите по <a href="${confirmLink}">ссылке</a> чтобы подтвердить адрес электронной почты</p>`
    });
};


// Password reset token
export const sendPasswordResetToken = async (email: string, token: string) => {
    const resetLink = `${DOMAIN_URL}/auth/new-password?token=${token}`;

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Смена пароля на БукЛайф',
        // mb change to react later
        html: `<p>Перейдите по <a href="${resetLink}">ссылке</a> чтобы изменить Ваш пароль</p>`
    })
};

// Two-factor Token
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Подтверждение аккаунта на БукЛайф',
        html: `<p>Ваш токен для подтверждения: ${token}</p>` 
    });
};
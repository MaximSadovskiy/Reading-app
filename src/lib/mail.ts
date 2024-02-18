import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// email-Verification token
export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Подтверждение email-адреса',
        // mb change to react later
        html: `<p>Перейдите по <a href="${confirmLink}">ссылке</a> чтобы подтвердить адрес электронной почты</p>`
    });
};


// Password reset token
export const sendPasswordResetToken = async (email: string, token: string) => {
    const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Смена пароля',
        // mb change to react later
        html: `<p>Перейдите по <a href="${resetLink}">ссылке</a> чтобы изменить Ваш пароль</p>`
    })
};
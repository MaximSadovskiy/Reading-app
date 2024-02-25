import crypto from "crypto";
import { v4 as uuid } from "uuid";
import { getPasswordResetTokenByEmail, getTwoFactorTokenByEmail, getVerificationTokenByEmail } from "./db_helpers";
import db from "@/database/db"; 

// Verification token
export const generateVerificationToken = async (email: string) => {
    const token = uuid();
    // 1 hour -> expires
    const expires = new Date(Date.now() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    // delete existing
    if (existingToken) {
        await db.verificationToken.delete({
            where: { id: existingToken.id }
        });
    }

    // generate new
    const newVerificationToken = await db.verificationToken.create({
        data: {
            token,
            email,
            expires,
        }
    });

    return newVerificationToken;
};


// Password reset token
export const generatePasswordResetToken = async (email: string) => {
    const token = uuid();
    // 1 hour -> expires
    const expires = new Date(Date.now() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);
    
    // delete existing
    if (existingToken) {
        await db.passwordResetToken.delete({
            where: { 
                email,
                token: existingToken.token,
            }
        });
    }

    // generate new
    const newPasswordResetToken = await db.passwordResetToken.create({
        data: {
            token,
            expires,
            email,
        }
    });

    return newPasswordResetToken;
};


// Two-Factor Token
export const generateTwoFactorToken = async (email: string) => {
    const token = String(crypto.randomInt(100_000, 1_000_000));
    const expires = new Date(Date.now() + 3600 * 1000);

    const existingToken = await getTwoFactorTokenByEmail(email);
    if (existingToken) {
        await db.twoFactorToken.delete({
            where: { id: existingToken.id }
        });
    }

    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            token,
            expires,
            email,
        }
    });

    return twoFactorToken;
};
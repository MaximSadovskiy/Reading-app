import { v4 as uuid } from "uuid";
import { getPasswordResetTokenByEmail, getVerificationTokenByEmail } from "./db_helpers";
import db from "@/lib/db"; 

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
import db from "@/database/db";

// USER methods
export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({
            where: {
                email,
            }
        });
    
        return user;
    } catch {
        return null;
    }
};


export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({
            where: {
                id,
            }
        });
    
        return user;
    } catch {
        return null;
    }
};

// Verification token
export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verificationToken = await db.verificationToken.findFirst({
            where: { email },
        });

        return verificationToken;
    } catch {
        return null;
    }
};

export const getVerificationTokenByToken = async (token: string) => {
    try {

        const verificationToken = await db.verificationToken.findUnique({
            where: { token },
        });

        return verificationToken;
    } catch {
        return null;
    }
};

// Password reset (forgot) token
export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const passwordResetToken = await db.passwordResetToken.findUnique({
            where: { token },
        });

        return passwordResetToken;
    } catch {
        return null;
    }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = await db.passwordResetToken.findFirst({
            where: { email },
        });

        return passwordResetToken;
    } catch {
        return null;
    }
};

// Two-Factor token
export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        const twoFactorToken = await db.twoFactorToken.findUnique({
            where: { token },
        });

        return twoFactorToken;
    } catch {
        return null;
    }
}

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await db.twoFactorToken.findFirst({
            where: { email },
        });

        return twoFactorToken;
    } catch {
        return null;
    }
}

// Two-Factor confirmation
export const getTwoFactorConfirmationByUserID = async (userId: string) => {
    try {
        const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
            where: { userId }
        });

        return twoFactorConfirmation;
    } catch {
        return null;
    }
}
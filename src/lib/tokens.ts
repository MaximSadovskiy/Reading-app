import { v4 as uuid } from "uuid";
import { getVerificationTokenByEmail } from "./db_helpers";
import db from "@/lib/db"; 


export const generateVerificationToken = async (email: string) => {
    const token = uuid();
    // 1 hour -> expires
    const expires = new Date(new Date().getTime() + 3600 * 1000); 

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
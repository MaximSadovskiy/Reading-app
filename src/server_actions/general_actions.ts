'use server';
import { signOut } from "$/auth";
import { getCurrentUserServer } from "@/hooks/useCurrentUser";

// SignOut
export const logOutAction = async (redirectUrl: string) => {
    const user = await getCurrentUserServer();
    if (user) {
        await signOut({ redirectTo: redirectUrl });
    }
};
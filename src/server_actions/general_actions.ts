'use server';
import { signOut } from "$/auth";
import { redirect } from "next/navigation";
import { useCurrentUserServer } from "@/hooks/useCurrentUser";

// SignOut
export const logOutAction = async (redirectUrl?: string) => {
    const user = await useCurrentUserServer();
    if (user) {
        await signOut({ redirect: false });
        if (typeof redirectUrl == 'string') {
            redirect(redirectUrl);
        }
    }
};
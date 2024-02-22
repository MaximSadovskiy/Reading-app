'use server';
import { signOut } from "$/auth";
import { useCurrentUserServer } from "@/hooks/useCurrentUser";
/* import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache"; */

// SignOut
export const logOutAction = async (redirectUrl: string) => {
    const user = await useCurrentUserServer();
    if (user) {
        await signOut({ redirectTo: redirectUrl });
    }
};
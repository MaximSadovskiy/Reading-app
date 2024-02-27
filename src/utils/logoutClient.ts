import { signOut, useSession } from "next-auth/react";

export const logoutOnClient = async () => {
    const session = useSession();
    if (session.data?.user) {
        await signOut();
    }
};
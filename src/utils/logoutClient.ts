import { signOut, useSession } from "next-auth/react";

export const useLogoutOnClient = async () => {
    const session = useSession();
    if (session.data?.user) {
        await signOut();
    }
};
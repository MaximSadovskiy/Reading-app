import { useSession } from "next-auth/react";
import { auth } from "$/auth";

export type UserType = ReturnType<typeof useCurrentUserClient>;
export type UserNoNullType = NonNullable<UserType>;

export const useCurrentUserClient = () => {
    const session = useSession();
    return session.data?.user;
};

export const useCurrentUserServer = async () => {
    const session = await auth();
    return session?.user;
};
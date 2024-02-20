'use server';
import { signOut } from "$/auth";
import { redirect } from "next/navigation";
import { auth } from "$/auth";

// SignOut
export const logOutAction = async () => {
    await signOut({ redirect: false });
    redirect('/auth/login');
};
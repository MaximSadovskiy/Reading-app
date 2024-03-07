'use client';
import { OpenBookSvg } from "@/components/shared/Svg";
import styles from "@/styles/modules/singleBookPage/readBook.module.scss";
import debounce from "@/utils/debounceDecorator";
import { useState } from "react";
import { addCurrentBookAction } from "@/server_actions/books_actions";
import type { UserType } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify"; 

type ReadBookProps = { 
    bookId: number;
    user: UserType;
};

export const ReadBook = ({ bookId, user }: ReadBookProps) => {

    // SVG
    const [isActiveSvg, setIsActiveSvg] = useState(false);

    // Svg active -- deactive
    const handleMouseEnter = () => {
        if (!isActiveSvg) {
            setIsActiveSvg(true)
        }
    };

    const handleMouseMove = debounce(() => {
        if (!isActiveSvg) {
            setTimeout(() => setIsActiveSvg(true), 0);
        }
    }, 150);

    const handleMouseLeave = () => {
        if (isActiveSvg) {
            setTimeout(() => setIsActiveSvg(false), 0);
        }
    }

    // redirect path
    const redirectPath = `/read/${bookId}`;
    const router = useRouter();

    const handleRedirectClick = async () => {
        if (user != null) {
            const result = await addCurrentBookAction(user.id as string, bookId);
            if (result.error) {
                toast(result.error, {
                    theme: 'colored',
                    type: 'error',
                });

                return;
            }
            else {
                toast(result.success, {
                    theme: 'colored',
                    type: 'success',
                });
                await new Promise(res => setTimeout(res, 500));
                router.push(redirectPath);
            }
        } else {
            // just redirect
            console.log('redirecting to ' + redirectPath);
            router.push(redirectPath);
        }
    }

    return (
        <div className={styles.wrapper}>
            <button className={styles.btn}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleRedirectClick}
            >
                <span>Читать</span>
                <OpenBookSvg width={60} height={60} isActive={isActiveSvg} />
            </button>
        </div>
    )
};
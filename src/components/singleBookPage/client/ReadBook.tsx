'use client';
import { OpenBookSvg } from "@/components/shared/Svg";
import styles from "@/styles/modules/singleBookPage/readBook.module.scss";
import debounce from "@/utils/debounceDecorator";
import { useState } from "react";
import Link from "next/link";


type ReadBookProps = { bookId: number };

export const ReadBook = ({ bookId }: ReadBookProps) => {

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

    return (
        <div className={styles.wrapper}>
            <Link className={styles.btn}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                href={redirectPath}
            >
                <span>Читать</span>
                <OpenBookSvg width={60} height={60} isActive={isActiveSvg} />
            </Link>
        </div>
    )
};
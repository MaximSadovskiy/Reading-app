import styles from "@/styles/modules/page_404/not-found.module.scss";
import Link from "next/link";
import Image from "next/image";

export default function NotFoundPage() {
    return (
        <main className={styles.main}>
            <div className={styles.titleWrapper}>
                <p>В мире книг можно найти ответы на любые вопросы...</p>
                <div className={styles.textWithSvg}>
                    <p>Но эта страница найдена не была</p>
                    <Image src="/emotions/sad.svg" width={100} height={100} alt="грустный смайлик" />
                </div>
                <Link href="/">Перейти на Главную страницу</Link>
            </div>
        </main>
    )
}
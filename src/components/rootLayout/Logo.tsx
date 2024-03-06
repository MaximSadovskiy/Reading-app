import Link from "next/link";
import styles from "@/styles/modules/rootLayout/logo.module.scss";

const Logo = () => {

    return (
        <Link href='/'>
            <h1 className={styles.logo}>
                Бук<span className={styles.span}>Лайф</span>
                <span className={styles.subLogo}>электронная библиотека</span>
            </h1>
        </Link>
    )
};

export default Logo;
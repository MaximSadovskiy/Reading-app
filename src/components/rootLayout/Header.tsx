import styles from '@/styles/modules/rootLayout/header.module.scss';
// components
import Link from 'next/link';
import Navbar from './Navbar';
import ThemeChanger from './ThemeChanger';
import AccountEnter from './AccountEnter';

const Header = () => {

    return (
        <header className={styles.header}>
            <Link href='/'>
                <h1 className={styles.logo}>
                    Бук<span className={styles.span}>Лайф</span>
                    <span className={styles.subLogo}>электронная библиотека</span>
                </h1>
            </Link>
            <Navbar />
            <ThemeChanger />
            <AccountEnter />
        </header>
    )
};

export default Header;
import styles from '@/styles/modules/rootLayout/header.module.scss';
// components
import Link from 'next/link';
import Navbar from './Navbar';
import ThemeChanger from './ThemeChanger';

const Header = () => {

    return (
        <header className={styles.header}>
            <Link href='/'>
                <h1 className={styles.logo}>БукЛайф</h1>
            </Link>
            <Navbar />
            <ThemeChanger />
        </header>
    )
};

export default Header;
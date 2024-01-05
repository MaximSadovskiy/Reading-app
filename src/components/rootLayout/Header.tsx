import styles from '@/styles/modules/rootLayout/header.module.scss';
import Link from 'next/link';
import Navbar from './Navbar';


const Header = () => {

    return (
        <header className={styles.header}>
            <Link href='/'>
                <h1 className={styles.logo}>БукЛайф</h1>
            </Link>
            <Navbar />
        </header>
    )
};

export default Header;
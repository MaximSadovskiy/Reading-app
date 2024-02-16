'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from '@/styles/modules/rootLayout/navbar.module.scss';

const Navbar = () => {

    const currentPath = usePathname();

    return (
        <nav className={styles.nav}>
            <ul className={styles.list}>
                <li>
                    <Link 
                        href='/' 
                        className={`${styles.link} ${currentPath === '/' ? styles.active : ''}`}
                    >Главная
                    </Link>
                </li>
                <li>
                    <Link 
                        href='/books' 
                        className={`${styles.link} ${currentPath === '/books' ? styles.active : ''}`}
                    >Книги
                    </Link>
                </li>
                <li>
                    <Link 
                        href='/read' 
                        className={`${styles.link} ${currentPath === '/writers' ? styles.active : ''}`}
                    >Чтение
                    </Link>
                </li>
                <li>
                    <Link 
                        href='/about' 
                        className={`${styles.link} ${currentPath === '/about' ? styles.active : ''}`}
                    >О нас
                    </Link>
                </li>
                <li>
                    <Link 
                        href='/my_library' 
                        className={`${styles.link} ${currentPath === '/my_library' ? styles.active : ''}`}
                    >Моя Библиотека
                    </Link>
                </li>
            </ul>
        </nav>
    )
};

export default Navbar;
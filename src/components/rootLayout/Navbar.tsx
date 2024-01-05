'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from '@/styles/modules/rootLayout/navbar.module.scss';

const Navbar = () => {

    const currentPath = usePathname();

    return (
        <nav>
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
                        href='/writers' 
                        className={`${styles.link} ${currentPath === '/writers' ? styles.active : ''}`}
                    >Писатели
                    </Link>
                </li>
                <li>
                    <Link 
                        href='/about' 
                        className={`${styles.link} ${currentPath === '/about' ? styles.active : ''}`}
                    >О нас
                    </Link>
                </li>
            </ul>
        </nav>
    )
};

export default Navbar;
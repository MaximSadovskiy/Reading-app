import styles from '@/styles/modules/readLayout/bookRedirect.module.scss';
import Link from 'next/link';

const BookRedirect = () => {
    const bookStr = "Тестовая книга: " + Math.round(Math.random() * 1000 % 999);
    return (
        <Link href='/read?book=test.txt' className={styles.redirect}>
            <div>{bookStr}</div>
        </Link>
    );
};
export default BookRedirect;
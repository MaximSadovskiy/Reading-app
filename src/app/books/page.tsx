import styles from '@/styles/modules/booksPage/booksPage.module.scss';
//components
import SearchBar from '@/components/booksPage/SearchBar';


export default function BooksPage() {

    return (
        <main className={styles.main}>
            <SearchBar />
        </main>
    )
}
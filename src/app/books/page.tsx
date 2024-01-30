import styles from '@/styles/modules/booksPage/booksPage.module.scss';
// types

//components
import SearchBar from '@/components/booksPage/client/SearchBar';
import { Suspense, lazy } from 'react';

// FETCHING helpers
const BASE_URL = 'http://localhost:3000/api/books/';

// lazy loading
const BookCarousel = lazy(() => import('@/components/booksPage/server/bookCarousel'));

export default async function BooksPage() {

    // fetching
    const url = `${BASE_URL}` + 'popular';
    const response = await fetch(url);
    const popularBooks = await response.json();

    return (
        <main className={styles.main}>
            <SearchBar />
            <Suspense fallback={<p>Loading...</p>}>
                <BookCarousel title='Популярные книги' books={popularBooks} />
            </Suspense>
        </main>
    )
}
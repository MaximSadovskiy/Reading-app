import styles from "@/styles/modules/booksPage/booksPage.module.scss";
import { booksInstance } from "@/booksStorage/usage/books";
//components
import SearchBar from "@/components/booksPage/client/SearchBar";
import { Suspense, lazy } from "react";
import { Spinner } from "@/components/shared/spinner";

// lazy loading
const BookCarousel = lazy(
	() => import("@/components/booksPage/server/bookCarousel")
);

export default async function BooksPage() {

	const popularBooks = booksInstance.retrieveBooksWithoutFiles().map(book => {
        const { id, title, author, rating, thumbnail } = book;

        return { id, title, author, rating, thumbnail };
    });

	return (
		<main className={styles.main}>
			<SearchBar />
			<Suspense fallback={<Spinner sizing='medium' />}>
				<BookCarousel
					title="Популярные книги"
					books={popularBooks} 
				/>
			</Suspense>
		</main>
	);
}

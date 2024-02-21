import styles from "@/styles/modules/booksPage/booksPage.module.scss";
//components
import SearchBar from "@/components/booksPage/SearchBar";
import { Suspense, lazy } from "react";
import { Spinner } from "@/components/shared/spinner";
import { CarouselBooks, getBookRecomendationsByGenre, getPopularBooksAction } from "@/server_actions/books_actions";
import { useCurrentUserServer } from "@/hooks/useCurrentUser";
import { getFavouriteGenres, getRandomGenres } from "@/lib/db_helpers_BOOKS";
import { GenreLiterals } from "@/interfaces/storage/bookInterface";
import Link from "next/link";
import { genreDescriptions } from "@/booksStorage/usage/genresDescription";

// lazy loading
const BookCarousel = lazy(
	() => import("@/components/booksPage/bookCarousel")
);

export default async function BooksPage() {

	// Popular Books
	const popularBooks = await getPopularBooksAction(15);
	
	// Recomended Books
	// check if user authorized
	const user = await useCurrentUserServer();
	const isAuthenticated = (user && user.id) ? true : false;
	let userFavouriteGenres: GenreLiterals[] | null = [];
	if (isAuthenticated) {
		userFavouriteGenres = await getFavouriteGenres(user?.id as string);
		if (userFavouriteGenres == null) {
			userFavouriteGenres = getRandomGenres();
		}
	}

	// storing Recomendation Carousels
	const recomendationStore: CarouselBooks[] = [];
	for (const genre of userFavouriteGenres) {
		const booksByGenre = await getBookRecomendationsByGenre(genre);
		recomendationStore.push(booksByGenre);
	}

	// rendering Recomendation Carousels
	const renderingRecomendationCarousels = recomendationStore.map(async (booksArray, index) => {
		const currentCarouselGenre = (userFavouriteGenres!)[index];
		let genreDescription = genreDescriptions.find(descriptionObject => {
			return descriptionObject.name === currentCarouselGenre;
		})?.description;

		// attach fallback description if genre was not found
		if (!genreDescription) {
			genreDescription = genreDescriptions.find(descriptionObject => descriptionObject.name === 'Fallback')?.description as string;
		}

		return (
			<Suspense fallback={<Spinner sizing='medium' />}>
				<BookCarousel 
					title={`Рекомендации по жанру: ${(userFavouriteGenres!)[index]}`}
					books={booksArray}
					genreDescription={genreDescription}
				/>
			</Suspense>
		)
	}
	);

	// description for popular carousel
	const popularDescription = genreDescriptions.find(desc => desc.name === 'Popular')?.description as string;

	return (
		<main className={styles.main}>
			<div>
				<p className={styles.subTitle}>
					На этой странице: 
				</p>
				<ul className={styles.list}>
					<li>Находите любую из книг имеющихся на нашем сайте</li>
					<li>Добавляйте книги в <Link href='/my_library'>персональную библиотеку</Link> (требуется авторизация)</li>
					<li>Посмотрите интересные подборки и рекомендации, подобранные на основе ваших интересов</li>
				</ul>
			</div>
			<SearchBar />
			<Suspense fallback={<Spinner sizing='medium' />}>
				<BookCarousel
					title='Популярные книги :'
					books={popularBooks}
					genreDescription={popularDescription} 
				/>
			</Suspense>
			{renderingRecomendationCarousels}
		</main>
	);
}

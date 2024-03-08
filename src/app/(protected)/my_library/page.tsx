import styles from "@/styles/modules/(protected)/myLibraryPage/myLibraryPage.module.scss";
import { DisplayOfBooks } from "@/components/my_library/DisplayOfBooks";
import { getAllLibraryBooks } from "@/server_actions/books_actions";
import { getCurrentUserServer } from "@/hooks/useCurrentUser";
import { LibraryBooksSuccess } from "@/server_actions/books_actions";
import { GenreLiterals, GenreValues } from "@/interfaces/storage/bookInterface";
import { getBooksByGenre } from "@/database/db_helpers_BOOKS";



const MyLibraryPage = async () => {
	const user = await getCurrentUserServer();
	if (!user) {
		return (
			<main className={styles.main}>
				<h2>К сожалению пользователь не был найден, попробуйте перезайти в аккаунт</h2>
			</main>
		);
	}

	const result = await getAllLibraryBooks(user.id as string);
    let allLibraryBooksOfUser: LibraryBooksSuccess = [];

    if (result.error) {
		return (
			<main className={styles.main}>
				<h2>К сожалению произошла ошибка, добавленные книги не были найдены</h2>
			</main>
		)
    }
	else {
		allLibraryBooksOfUser = result.success as LibraryBooksSuccess;
	}

	// create list of books for each genre
	const booksByGenreMap: Map<GenreLiterals[number], LibraryBooksSuccess> = new Map();
	// if all of arrays are 0 length 
	let isEmptyMap = true;

	// name of genre --> booksOfThisGenre array 
	for (const genre of GenreValues) {
		if (!booksByGenreMap.has(genre)) {
			const booksOfGenre = getBooksByGenre(allLibraryBooksOfUser, genre);

			booksByGenreMap.set(genre, booksOfGenre);
		}
	}

	for (const booksArray of booksByGenreMap.values()) {
		if (booksArray.length > 0) {
			isEmptyMap = false;
			break;
		}
	}

	return (
		<main className={styles.main}>
			<h2>Добро пожаловать в вашу личную библиотеку!</h2>
			<p>Здесь собраны все книги, которые вы сюда добавляли</p>
			<DisplayOfBooks  
                booksByGenre={booksByGenreMap}
				isEmpty={isEmptyMap} 
            />
		</main>
	);
};

export default MyLibraryPage;

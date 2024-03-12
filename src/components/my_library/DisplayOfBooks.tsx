import { LibraryBooksSuccess } from "@/server_actions/books_actions";
import { GenreLiterals } from "@/interfaces/storage/bookInterface";
import { GenreDescription, genreDescriptions } from "@/booksStorage/textData/genresDescription";
import styles from "@/styles/modules/(protected)/myLibraryPage/displayOfBooks.module.scss";
import BookCarousel from "../booksPage/bookCarousel";
import SearchBar from "../booksPage/SearchBar";
import { SEARCH_MY_LIBRARY_BOOKS_URL } from "@/apiUrls";
import Link from "next/link";
import Image from "next/image";

type MapOfBooks = Map<GenreLiterals[number], LibraryBooksSuccess>;

interface DisplayOfBooksProps {
    booksByGenre: MapOfBooks;
    isEmpty: boolean
}

export const DisplayOfBooks = ({ booksByGenre, isEmpty }: DisplayOfBooksProps) => {

    // if every array is 0 length
    if (isEmpty) {
        return (
            <section className={styles.mainSection} data-empty={true}>
                <div className={styles.emptyTitleWrapper}>
                    <h3>К сожалению, Вы ещё не добавляли книг</h3>
                    <Image src="/emotions/sad.svg" width={100} height={100} alt="грустный смайлик" />
                </div>
                <p>Добавить их можно здесь: </p>
                <Link href='/books'>Смотреть все книги</Link>
            </section>
        )
    }

    const renderingCarousels = [];
    
    // collecting carousels and pushing to array of rendering
    for (const [genre, arrayOfBooks] of booksByGenre.entries()) {

        if (arrayOfBooks.length === 0) {
            continue;
        };

        const title = `Ваши книги из "${genre}" :`;

        const genreDescriptionObject = genreDescriptions.find(descriptionObject => {
            return descriptionObject.name === genre;
        }) as NonNullable<GenreDescription>;

        // get string description of genre
        const genreDescription = genreDescriptionObject.description;

        const carousel = (
            <BookCarousel 
                title={title} 
                genreDescription={genreDescription}
                books={arrayOfBooks} 
            />
        );

        renderingCarousels.push(carousel);
    }

    return (
        <section className={styles.mainSection}>
            <SearchBar 
                pageName='my_library'
            />
            {renderingCarousels}  
        </section>
    )
};
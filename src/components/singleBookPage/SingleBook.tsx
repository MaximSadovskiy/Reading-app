import styles from "@/styles/modules/singleBookPage/singleBookSection.module.scss";
import { getAuthorDisplayName } from "@/utils/textFormat/getAuthorDisplayName";
import { dotsToParagraphs } from "@/utils/textFormat/dotsToParagraphs";
import type { ReturnGetBookByIdType } from "@/lib/db_helpers_BOOKS";
import { Poll } from "./client/Poll";
import type { UserType } from "@/hooks/useCurrentUser";
import { AddToLibrary } from "./client/AddToLibrary";



type SingleBookProps = {
    book: NonNullable<ReturnGetBookByIdType>;
    user: UserType;
    ratingScore: number | null;
    isLibBookExist: boolean;
}

export const SingleBookSection = ({ book, user, ratingScore, isLibBookExist }: SingleBookProps) => {

    const { id, title, author, year, genres, description, quotes, rating } = book;
    const authorName = author.name;
    const authorFormattedName = getAuthorDisplayName(authorName, false);

    // description
    const formattedDescription = dotsToParagraphs(description);

    // genres
    const renderingGenres = genres.map(genre => (
        <li key={genre}>{genre}</li>
    ));

    //quotes  
    const renderingQuotes = quotes.map(quote => (
        <li key={quote}>"{' '}{quote}{' '}"</li>
    ));

    return (
        <section className={styles.bookSection}>
            <div className={styles.generalInfoWrapper}>
                <h2 className={styles.title}>"{title}"</h2>
                <p className={styles.author}>{authorFormattedName}</p>
                <p className={styles.year}>{year}</p>
            </div>
            {/* Pictures gallery */}
            <div className={styles.genres}>
                <h3 className={styles.genresTitle}>Жанры литературы</h3>
                <ul>
                    {renderingGenres}
                </ul>
            </div>
            <div className={styles.description}>
                <h3>Краткое описание</h3>
                <div>{formattedDescription}</div>
            </div>
            <div className={styles.quotes}>
                <h3>Избранные цитаты</h3>
                <ul>
                    {renderingQuotes}
                </ul>
            </div>
            <div className={styles.rating}>
                <h3>Рейтинг книги: {rating}</h3>
                <Poll 
                    bookId={id} 
                    user={user}
                    ratingScore={ratingScore}  
                />
                <AddToLibrary 
                    bookId={id} 
                    user={user}
                    isLibBookExist={isLibBookExist}
                />
            </div>
        </section>
    )
}
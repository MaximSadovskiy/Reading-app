import type { GenreLiterals } from "@/interfaces/storage/bookInterface";
import { GenreValues } from "@/interfaces/storage/bookInterface";
import { getUserById } from "./db_helpers";
import db from "./db";
import type { PromiseValueType } from "@/interfaces/promiseValueTypeUtil";

// Favourite genres
export const getFavouriteGenres = async (userId: string): Promise<GenreLiterals[] | null> => {
    const user = await getUserById(userId);
    if (!user) {
        return null;
    }

    return user.favouriteGenres as GenreLiterals[];
};

// RandomGenres (if user is not Sign In)
export const getRandomGenres = (count: number = 3) => {
    const randomGenresResult: GenreLiterals[] = [];
    const range = GenreValues.length;

    while (randomGenresResult.length != count) {
        const randomIndex = Math.floor(Math.random() * range);
        const randomGenre = GenreValues[randomIndex];
        if (!randomGenresResult.includes(randomGenre)) {
            randomGenresResult.push(randomGenre);
        }
    }

    return randomGenresResult;
};

// Search books by title
export type SearchByTitleReturn = ReturnType<typeof searchBooksByTitle>;
export const searchBooksByTitle = async (query: string) => {
    const booksByTitle = await db.book.findMany({
        where: { title: {
            contains: query,
            mode: 'insensitive',
        }},
        orderBy: { rating: 'desc' },
        select: {
            id: true,
            title: true,
            rating: true, 
            author: {
                select: {
                    name: true,
                }
            },
        }
    });

    if (!booksByTitle) {
        return null;
    }

    return booksByTitle;
};


// Search by author
export type SearchByAuthorReturn = ReturnType<typeof searchBooksByAuthor>; 
export const searchBooksByAuthor =  async (query: string) => {
    const booksByAuthor = await db.author.findFirst({
        where: { name: { 
            contains: query,
            mode: 'insensitive', 
        }},
        select: {
            name: true,
            books: {
                orderBy: { rating: 'desc' },
                select: {
                    id: true,
                    title: true,
                    rating: true,
                }
            },
        }
    });

    if (!booksByAuthor) return null;

    return booksByAuthor;
};

// SINGLE BOOK PAGE
type ReturnGetBookByIdPromise = ReturnType<typeof getBookById>;
export type ReturnGetBookByIdType = PromiseValueType<ReturnGetBookByIdPromise>;

export const getBookById = async (id: number) => {
    const book = await db.book.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    name: true,
                }
            }
        }
    });

    if (!book) return null;

    return book;
}; 


// Update Rating ob book
export const updateBookRating = async (bookId: number) => {
    const book = await db.book.findUnique({
        where: { id: bookId },
        include: {
            ratingScores: true,
        }
    })
    if (!book) {
        return { error: 'no book found' };
    }

    // all records (separate Rating tables)
    const allRatingScoresOfBook = book.ratingScores;

    // counting sumValue of all scores
    const sumValue = allRatingScoresOfBook.reduce<number>((acc, curr) => {
        return acc + curr.ratingScore;
    }, 0);

    // getting medium value for rating
    let newRatingScoreValue = parseFloat((sumValue / allRatingScoresOfBook.length).toFixed(1));

    if (!newRatingScoreValue || typeof newRatingScoreValue !== 'number') {
        newRatingScoreValue = 7.5;
    }

    // update Medium Rating value
    await db.book.update({
        where: { id: book.id },
        data: {
            // 7.5 as a default value
            rating: newRatingScoreValue,
        }
    });

    return { success: 'value updated successfully' }
};
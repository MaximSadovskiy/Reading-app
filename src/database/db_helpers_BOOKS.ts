import type { GenreLiterals } from "@/interfaces/storage/bookInterface";
import { GenreValues } from "@/interfaces/storage/bookInterface";
import { getUserById } from "./db_helpers";
import db from "./db";
import type { PromiseValueType } from "@/interfaces/promiseValueTypeUtil";
import { LibraryBooksSuccess } from "@/server_actions/books_actions";
import { getAuthorDisplayName } from "@/utils/textFormat/getAuthorDisplayName";

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
            startsWith: query,
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
            startsWith: query,
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


// My_library search
export const searchMyLibraryBooksByTitle = async (title: string, userId: string) => {
    const allMyLibBooks = await db.libraryBook.findMany({
        where: {
            userId,
            book: {
                title: { startsWith: title, mode: 'insensitive', }
            }
        },
        select: {
            book: {
                select: {
                    id: true,
                    title: true,
                    rating: true,
                    author: {
                        select: { 
                            name: true,
                        }
                    }
                },
            },
        }
    });

    const returnBooks = allMyLibBooks.map(dataWrapper => {
        const { id, title, author, rating } = dataWrapper.book;

        const authorDisplayName = getAuthorDisplayName(author.name, false);

        return { id, title, authorDisplayName, rating };
    });

    return returnBooks;
};


export const searchMyLibraryBooksByAuthor = async (authorName: string, userId: string) => {
    const allBooksWithAuthorName = await db.libraryBook.findMany({
        where: {
            userId,
            book: {
                author: {
                    name: { startsWith: authorName, mode: 'insensitive', }
                }
            }
        },
        select: {
            book: {
                select: {
                    id: true,
                    title: true,
                    rating: true,
                    author: {
                        select: {
                            name: true,
                        }
                    }
                }
            }
        }
    });

    const returnBooks = allBooksWithAuthorName.map(wrapperObject => {
        const { id, title, rating, author} = wrapperObject.book;

        const authorDisplayName = getAuthorDisplayName(author.name, false);

        return { id, title, authorDisplayName, rating };
    });

    return returnBooks;
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

// COMMENTS & LIKES

// is user liked this comment
// MB DELETE LATER
export const getIfUserLikedComment = async (authorId: string, bookId: number, commentId: string) => {
    
    const like = await db.like.findUnique({
        where: {
            likeId: {
                authorId,
                bookId,
                commentId,
            }
        }
    });
    if (!like) return false;

    return true;
};


export const getCommentById = async (commentId: string) => {
    const comment = await db.comment.findUnique({
        where: { id: commentId }
    });
    if (!comment) {
        return null;
    }
    return comment;
};



// update likesCount field of comment
export const updateLikesCountOfComment = async (commentId: string) => {
    const likesOfComment = await db.like.findMany({
        where: { commentId },
    });
    if (!likesOfComment) return;

    const newLikesCount = likesOfComment.length;
    
    // find comment and update likesCount
    await db.comment.update({
        where: { id: commentId },
        data: {
            likesCount: newLikesCount,
        }
    });

    return { success: 'likesCount field was successfully incremented' }
}


// My_library
export const getBooksByGenre = (booksArray: LibraryBooksSuccess, genre: GenreLiterals[number]) => { 

    const allBooksWithGenre = booksArray.filter(book => {
        return book.genres.includes(genre);
    });

    return allBooksWithGenre;
};
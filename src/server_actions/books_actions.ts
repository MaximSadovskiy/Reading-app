'use server';
import db from "@/database/db";
import { PromiseValueType } from "@/interfaces/promiseValueTypeUtil";
import { GenreLiterals } from "@/interfaces/storage/bookInterface";
import { getUserById } from "@/database/db_helpers";
import { getBookById, getCommentById, updateBookRating, updateLikesCountOfComment } from "@/database/db_helpers_BOOKS";
import { revalidatePath } from "next/cache";
import { auth } from "$/auth";

// Popular Books
type PopularBooksReturnTypePromise = ReturnType<typeof getPopularBooksAction>;
export type CarouselBooks = PromiseValueType<PopularBooksReturnTypePromise>;

// errors
enum ErrorMessages {
    USER_NO_FOUND = 'Ошибка: пользователь не был найден, попробуйте перезайти в аккаунт',
    USER_UNAUTHORIZED = 'Ошибка: пользователь не авторизован, войдите в аккаунт, чтобы совершить действие',
    BOOK_NO_FOUND = 'Ошибка: книга не найдена, приносим свои извинения',
    COMMENT_NO_FOUND = 'Ошибка, комментарий не найден',
    LIKE_ALREADY_EXIST = 'Ошибка, вы не можете поставить лайк одному комментарию больше 1 раза',
}

export const getPopularBooksAction = async (limit: number) => {
    const booksOnGenre = await db.book.findMany({
        take: limit,
        orderBy: { rating: 'desc' },
        select: {
            id: true,
            title: true,
            thumbnail: true,
            rating: true,
            author: {
                select: {
                    name: true,
                }
            }
        }
    });

    // id, title, author, rating, thumbnail
    const recomendationBooks = booksOnGenre.map(book => {
        const { id, title, author, thumbnail, rating } = book;

        return { id, title, authorName: author.name, thumbnail, rating}
    });


    return recomendationBooks;
};


// Recomendation Books by genre
export const getBookRecomendationsByGenre = async (genre: GenreLiterals, limit: number = 10): Promise<CarouselBooks> => {
    const booksOnGenre = await db.book.findMany({
        where: { genres: { has: genre }},
        take: limit,
        orderBy: { rating: 'desc' },
        select: {
            id: true,
            title: true,
            thumbnail: true,
            rating: true,
            author: {
                select: {
                    name: true,
                }
            }
        }
    });

    // id, title, author, rating, thumbnail
    const recomendationBooks = booksOnGenre.map(book => {
        const { id, title, author, thumbnail, rating } = book;

        return { id, title, authorName: author.name, thumbnail, rating}
    });


    return recomendationBooks;
};

// SIGNLE BOOK page

// rate book
export const rateBookAction = async (ratingScore: number, userId: string, bookId: number) => {
    const user = await getUserById(userId);
    if (!user) {
        return { error: ErrorMessages['USER_NO_FOUND'] };
    }
    const book = await getBookById(bookId);
    if (!book) {
        return { error: ErrorMessages['BOOK_NO_FOUND'] };
    }
    // check if Authorized (2 time for edge cases)
    const isAuthorized = await auth();
    if (!isAuthorized) {
        return { error: ErrorMessages['USER_UNAUTHORIZED']}
    }

    // if user already rate book
    const hasAlreadyRate = await db.rating.findUnique({
        where: {
            ratingId: {
                userId: user.id,
                bookId: book.id,
            }
        }
    });

    if (hasAlreadyRate) {
        return { error: 'Ошибка: вы не можете оценивать одну книгу более одного раза' }
    }

    // create new Rating record
    await db.rating.create({
        data: {
            ratingScore,
            userId: user.id,
            bookId: book.id,
        }
    });

    // update Global book rating
    await updateBookRating(book.id);

    revalidatePath('/books');

    return { success: 'Спасибо, что поделились своим мнением' }
};

// Unrate book
export const unrateBookAction = async (userId: string, bookId: number) => {
    const user = await getUserById(userId);
    if (!user) {
        return { error: ErrorMessages['USER_NO_FOUND'] };
    }
    const book = await getBookById(bookId);
    if (!book) {
        return { error: ErrorMessages['BOOK_NO_FOUND'] };
    }

    // deleting rating record
    await db.rating.delete({
        where: { 
            ratingId: {
                userId: user.id,
                bookId: book.id,
            }
        },
    });

    // update Global book rating
    await updateBookRating(book.id);

    revalidatePath('/books');

    return { success: 'Оценка отменена!' }
};

// Get existing rating score of book by user
type GetRatingScorePromise = ReturnType<typeof getRatingScoreAction>;
export type GetRatingScore = PromiseValueType<GetRatingScorePromise>; 

export const getRatingScoreAction = async (userId: string, bookId: number) => {
    const user = await getUserById(userId);
    if (!user) {
        return { exist: false, value: null };
    }

    const book = await getBookById(bookId);
    if (!book) {
        return { exist: false, value: null };
    }

    const rating = await db.rating.findUnique({
        where: { 
            ratingId: {
                userId: user.id,
                bookId: book.id,
            }
        },
    });
    if (!rating) {
        return { exist: false, value: null };
    }

    return { exist: true, value: rating.ratingScore };
};


// Add to Personal Library
export const addBookToLibraryAction = async (userId: string, bookId: number) => {
    const user = await getUserById(userId);
    if (!user) {
        return { error: ErrorMessages['USER_NO_FOUND'] };
    }
    const book = await getBookById(bookId);
    if (!book) {
        return { error: ErrorMessages['BOOK_NO_FOUND'] };
    }

    // if already inside user library
    const isAlreadyInLibrary = await db.libraryBook.findUnique({
        where: {
            libraryBookId: {
                userId,
                bookId,
            }
        }
    });

    if (isAlreadyInLibrary) {
        return { error: 'Книга уже есть в вашей библиотеке' }
    }

    await db.libraryBook.create({
        data: {
            userId,
            bookId,
        }
    });

    return { success: 'Книга добавлена в вашу библиотеку!' }
};


// delete from library
export const deleteFromLibraryAction = async (userId: string, bookId: number) => {
    const user = await getUserById(userId);
    if (!user) {
        return { error: ErrorMessages['USER_NO_FOUND'] };
    }
    const book = await getBookById(bookId);
    if (!book) {
        return { error: ErrorMessages['BOOK_NO_FOUND'] };
    }

    // deleting book
    await db.libraryBook.delete({
        where: {
            libraryBookId: {
                userId,
                bookId,
            }
        }
    });

    revalidatePath('/my_library');

    return { success: 'Книга удалена из вашей библиотеки!' }
}

// GET existing library book
type GetLibraryBookPromise = ReturnType<typeof getLibraryBookAction>;
export type GetLibraryBook = PromiseValueType<GetLibraryBookPromise>;

export const getLibraryBookAction = async (userId: string, bookId: number) => {
    const user = await getUserById(userId);
    if (!user) {
        return { exist: false };
    }

    const book = await getBookById(bookId);
    if (!book) {
        return { exist: false };
    }

    // find book
    const libraryBook = await db.libraryBook.findUnique({
        where: { libraryBookId: {
            userId,
            bookId,
        }}
    });

    if (libraryBook) {
        return { exist: true }
    } else {
        return { exist: false }
    }
};  


// COMMENTS & LIKES

// get comments of book, paginated
type GetBookCommentsPromise = ReturnType<typeof getCommentsOfBookById>;
type GetBookComments = PromiseValueType<GetBookCommentsPromise>;
export type CommentsType = NonNullable<GetBookComments>['success'];

export const getCommentsOfBookById = async (bookId: number, offset: number, countToTake: number) => {
    const comments = await db.comment.findMany({
        where: { bookId },
        // test
        include: { likes: true },
        // по популярности
        orderBy: { likesCount: 'desc' },
        // pagination
        take: countToTake,
        skip: offset,
    });
    if (!comments) {
        return null;
    }

    return { success: comments }
}

// get how many comments book have (length)
export const getNumberOfAllComments = async (bookId: number) => {
    const allComments = await db.comment.findMany({
        where: { bookId },
    });

    const numberOfComments = allComments.length;
    
    return numberOfComments; 
}


// Add comment
export const addCommentAction = async (content: string, userId: string, bookId: number) => {
    const user = await getUserById(userId);
    if (!user) {
        return { error: ErrorMessages['USER_NO_FOUND'] };
    }
    const book = await getBookById(bookId);
    if (!book) {
        return { error: ErrorMessages['BOOK_NO_FOUND'] };
    }

    await db.comment.create({
        data: {
            content,
            authorId: userId,
            authorName: user.username,
            bookId,
            createdAt: new Date(),
            likesCount: 0,
        }
    });

    revalidatePath(`/books/${bookId}`);

    return { success: 'Комментарий успешно добавлен! Чтобы увидеть изменение - перезагрузите страницу:)' }
}


// Delete Comment
export const deleteCommentAction = async (commentId: string, bookId: number) => {
    // check if it exist first
    const existingComment = await db.comment.findUnique({
        where: { id: commentId }
    });
    if (!existingComment) {
        return { error: ErrorMessages.COMMENT_NO_FOUND }
    }

    await db.comment.delete({
        where: {
            id: commentId,
        }
    });

    revalidatePath(`/books/${bookId}`);

    return { success: 'Комментарий успешно удалён! Чтобы увидеть изменение - перезагрузите страницу:)' }
}

// LIKE ACTION
export const addLikeAction = async (authorId: string, bookId: number, commentId: string) => {
    const user = await getUserById(authorId);
    if (!user) {
        return { error: ErrorMessages['USER_NO_FOUND'] };
    }
    const book = await getBookById(bookId);
    if (!book) {
        return { error: ErrorMessages['BOOK_NO_FOUND'] };
    }
    const comment = await getCommentById(commentId);
    if (!comment) {
        return { error: ErrorMessages['COMMENT_NO_FOUND']}
    }

    // check if like already exist
    const existingLike = await db.like.findUnique({
        where: { likeId: {
            bookId,
            authorId,
            commentId,
        }}
    });
    if (existingLike) {
        return { error: ErrorMessages['LIKE_ALREADY_EXIST'] }
    }

    // creating like
    await db.like.create({
        data: {
            authorId,
            bookId,
            commentId,
        }
    });


    // update like count of comment
    await updateLikesCountOfComment(commentId);

    // revalidate
    revalidatePath(`/books/${bookId}`);

    return { success: 'Действие выполнено успешно!' }
}

// remove like
export const removeLikeAction = async (authorId: string, bookId: number, commentId: string) => {
    const user = await getUserById(authorId);
    if (!user) {
        return { error: ErrorMessages['USER_NO_FOUND'] };
    }
    const book = await getBookById(bookId);
    if (!book) {
        return { error: ErrorMessages['BOOK_NO_FOUND'] };
    }
    const comment = await getCommentById(commentId);
    if (!comment) {
        return { error: ErrorMessages['COMMENT_NO_FOUND']}
    }

    // remove like
    await db.like.delete({
        where: { likeId: {
            authorId,
            commentId,
            bookId,
        }}
    });

    // update like count of comment
    await updateLikesCountOfComment(commentId);

    // revalidate
    revalidatePath(`/books/${bookId}`);

    return { success: 'Действие успешно отменено!' }
}


// MY_LIBRARY
type LibraryBooksPromise = ReturnType<typeof getAllLibraryBooks>;
export type LibraryBooks = PromiseValueType<LibraryBooksPromise>;
export type LibraryBooksSuccess = NonNullable<LibraryBooks['success']>;

export const getAllLibraryBooks = async (userId: string) => {
    const libraryBooks = await db.libraryBook.findMany({
        where: { userId },
        select: {
            book: {
                select: {
                    id: true,
                    title: true,
                    thumbnail: true,
                    rating: true,
                    genres: true,
                    author: {
                        select: {
                            name: true,
                        }
                    }
                }
            }
        }
    });

    // check if length === 0 - должно проходить через ошибку
    if (libraryBooks === null) {
        return { error: 'no books' };
    }

    const booksData = libraryBooks.map((libBook) => {

        const { id, title, author, thumbnail, rating, genres } = libBook.book;

        return { id, title, thumbnail, rating, authorName: author.name, genres }
    });

    return { success: booksData };
};


// Current Read book
// add only if user authorized
export const addCurrentBookAction = async (userId: string, bookId: number) => {
    const user = await db.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        return { error: ErrorMessages.USER_NO_FOUND}
    }

    const book = await db.book.findUnique({
        where: { id: bookId },
        select: { title: true }
    });
    if (!book) {
        return { error: ErrorMessages.BOOK_NO_FOUND }
    }

    // if exists already
    const existingCurrentBook = await db.currentReadBook.findFirst({
        where: { 
            userId,
        }
    });
    // delete it
    if (existingCurrentBook) {
        await db.currentReadBook.delete({
            where: {
                userId,
            }
        })
    }

    // create new
    await db.currentReadBook.create({
        data: {
            userId,
            bookId,
        }
    });

    return { success: `Книга ${book.title} добавлена в "Читальный Зал"` }
};


// current read book
export const getCurrentReadBookId = async (userId: string) => {
    const book = await db.currentReadBook.findFirst({
        where: { userId },
        select: { bookId: true },
    });

    if (!book) {
        return { error: 'Читаемая книга не выбрана, чтобы перейти - пожалуйста, выберите желаемую книгу на странице "Книги" этого сайта' };
    }

    return { success: book.bookId }
};  
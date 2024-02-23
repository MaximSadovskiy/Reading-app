'use server';
import db from "@/lib/db";
import { PromiseValueType } from "@/interfaces/promiseValueTypeUtil";
import { GenreLiterals } from "@/interfaces/storage/bookInterface";
import { getUserById } from "@/lib/db_helpers";
import { getBookById, updateBookRating } from "@/lib/db_helpers_BOOKS";
import { revalidatePath } from "next/cache";

// Popular Books
type PopularBooksReturnTypePromise = ReturnType<typeof getPopularBooksAction>;
export type CarouselBooks = PromiseValueType<PopularBooksReturnTypePromise>;

export const getPopularBooksAction = async (limit: number) => {
    const books = await db.book.findMany({
        take: limit,
        orderBy: { rating: 'desc' },
        include: { author: true },
    });

    // id, title, author, rating, thumbnail
    const popularBooks = books.map(book => {

        const { id, title, thumbnail, rating, author } = book;
        const { name } = author;

        return { id, title, authorName: name, thumbnail, rating };
    });

    return popularBooks;
};


// Recomendation Books by genre
export const getBookRecomendationsByGenre = async (genre: GenreLiterals, limit: number = 10): Promise<CarouselBooks> => {
    const booksOnGenre = await db.book.findMany({
        where: { genres: { has: genre }},
        take: limit,
        orderBy: { rating: 'desc' },
        include: { author: true },
    });

    // id, title, author, rating, thumbnail
    const recomendationBooks = booksOnGenre.map(book => {

        const { id, title, thumbnail, rating, author } = book;
        const { name } = author;

        return { id, title, authorName: name, thumbnail, rating };
    });


    return recomendationBooks;
};

// SIGNLE BOOK page

// rate book
export const rateBookAction = async (ratingScore: number, userId: string, bookId: number) => {
    const user = await getUserById(userId);
    if (!user) {
        return { error: 'Ошибка: пользователь не был найден, попробуйте перезайти в аккаунт' };
    }
    const book = await getBookById(bookId);
    if (!book) {
        return { error: 'Ошибка: книга не найдена, приносим свои извинения' };
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
        return { error: 'Ошибка: пользователь не был найден, попробуйте перезайти в аккаунт' };
    }
    const book = await getBookById(bookId);
    if (!book) {
        return { error: 'Ошибка: книга не найдена, приносим свои извинения' };
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
export type GetRatingScoreAction = PromiseValueType<GetRatingScorePromise>; 

export const getRatingScoreAction = async (userId: string, bookId: number) => {
    const user = await getUserById(userId);
    if (!user) {
        return { exist: false, value: null };
    }

    const book = await getBookById(bookId);
    if (!book) {
        return { exist: false, value: null };
    }

    const rating = await db.rating.findFirst({
        where: { 
            userId: user.id,
            bookId: book.id,
        } 
    });
    if (!rating) {
        return { exist: false, value: null };
    }

    return { exist: true, value: rating.ratingScore };
};
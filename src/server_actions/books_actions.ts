'use server';
import db from "@/lib/db";
import { PromiseValueType } from "@/interfaces/promiseValueTypeUtil";
import { GenreLiterals } from "@/interfaces/storage/bookInterface";

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
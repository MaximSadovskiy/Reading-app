import { BookInterface } from "@/interfaces/bookInterface";
import { booksData } from "./storage";

// export helpers
export type BooksWithoutFiles = Omit<BookInterface, 'files' | 'ratingMarks'>[];
export type BooksForSearch = Pick<BookInterface, 'id' | 'title' | 'author' | 'rating'>[];
export type CarouselBooks = Pick<BookInterface, 'id' | 'title' | 'author' | 'rating' | 'thumbnail'>[];


// MAIN STORAGE
class BooksClass {
    books: BookInterface[];

    constructor() {
        this.books = booksData;
    }

    // all books data
    retrieveBooks() {
        return this.books;
    }

    retrieveBooksWithoutFiles() {
        const booksWithoutFiles: BooksWithoutFiles = this.books.map(book => {
            const { id, title, author, authorForSearch, year, description, quotes, rating, genres, thumbnail, picture } = book;

            return {
                id,
                title,
                author,
                authorForSearch,
                year,
                description,
                quotes,
                genres,
                rating,
                thumbnail,
                picture
            };
        });

        return booksWithoutFiles;
    }

    // TODO
    // sort algorithm
    retrievePopularBooks(limit: number) {

    }

    getBookById(id: string) {
        const book = this.books.find(book => book.id === id);
        return book;
    }
}


export const booksInstance = new BooksClass();  
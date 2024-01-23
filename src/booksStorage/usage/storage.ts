import fs from 'node:fs';
import BookInterface, { BookInputInterface } from '@/interfaces/bookInterface';

// MAIN STORAGE
const books: BookInterface[] = [];
export default books;

let bookId = 0;

// methods to access storage

// ADD
export type addBookType = (bookInput: BookInputInterface) => BookInterface;

export const addBook: addBookType = (bookInput) => {
    const { name, author, year, description, quotes } = bookInput;
    const book = fs.readFileSync(bookInput.paths.book);
    const img = fs.readFileSync(bookInput.paths.img);
    const id = String(bookId++);

    console.log(bookId);

    return {
        id: id,
        name,
        author,
        year,
        description,
        quotes,
        files: {
            book,
            img
        }
    }
};
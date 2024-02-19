import { NextRequest, NextResponse } from 'next/server';
import { booksInstance as books } from '@/booksStorage/usage/books';
import type { BooksForSearch } from '@/booksStorage/usage/books';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {

    try {
        const searchParams = request.nextUrl.searchParams;

        // working on query
        const mode = searchParams.get('mode') as 'title' | 'author';
        const query = searchParams.get('query')?.trim().toLowerCase() as string;

        // formatting data for response
        const initBooks = books.retrieveBooksWithoutFiles();
        let responseBooks: BooksForSearch = [];

        let filteredBooks = [];
        // title search
        if (mode === 'title') {
            filteredBooks = initBooks.filter(book => {
                const lowercasedBookTitle = book.title.toLowerCase();

                return lowercasedBookTitle.includes(query);
            });
        }

        // author search
        else {
            filteredBooks = initBooks.filter(book => {
                const lowercasedAuthorName = book.authorForSearch;

                return lowercasedAuthorName.includes(query);
            });
        }

        responseBooks = filteredBooks.map(book => {
            const { id, title, author, rating } = book;

            return {
                id,
                title,
                author,
                rating
            }
        });

        return NextResponse.json(responseBooks);
    } catch (err) {

    }
}
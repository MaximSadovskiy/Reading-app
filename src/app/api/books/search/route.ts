import { NextRequest, NextResponse } from 'next/server';
import { booksInstance as books } from '@/booksStorage/usage/storage';
import type { BooksForSearch } from '@/booksStorage/usage/storage';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {

    try {
        const searchParams = request.nextUrl.searchParams;

        // working on query
        const mode = searchParams.get('mode') as 'title' | 'author';
        const query = searchParams.get('query')?.toLowerCase() as string;

        // formatting data for response
        const initBooks = books.retrieveBooksWithoutFiles();
        let responseBooks: BooksForSearch = [];

        let filteredBooks = [];
        if (mode === 'title') {
            filteredBooks = initBooks.filter(book => {
                const lowercasedBookTitle = book.title.toLowerCase();

                return lowercasedBookTitle.includes(query);
            });
        }

        else {
            filteredBooks = initBooks.filter(book => {
                const lowercasedAuthorName = book.author.toLowerCase();

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
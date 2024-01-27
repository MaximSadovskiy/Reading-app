import { NextRequest, NextResponse } from 'next/server';
import books, { retrieveBooksWithoutFiles } from '@/booksStorage/usage/storage';
import { BookInterface } from '@/interfaces/bookInterface'; 

export const dynamic = 'force-dynamic';

// types
type BooksWithoutFiles = Omit<BookInterface, 'files'>[];
export type BooksForSearch = Pick<BookInterface, 'name' | 'author'>[];

export async function GET(request: NextRequest) {
    console.log('get request');

    try {
        const searchParams = request.nextUrl.searchParams;

        // working on query
        const query = searchParams.get('query') as string;
        const mode = searchParams.get('mode') as 'name' | 'author';
        const caseInsensetiveQuery = decodeURIComponent(query.toString().toLowerCase().trim());


        // formatting data for response
        const initBooks: BooksWithoutFiles = retrieveBooksWithoutFiles();
        let responseBooks: BooksForSearch = [];
        
        let filteredBooks: BooksWithoutFiles = [];
        if (mode === 'name') {
            filteredBooks = initBooks.filter(book => {
                return book.name.includes(caseInsensetiveQuery);
            });
        }

        else {
            filteredBooks = initBooks.filter(book => {
                return book.author.includes(caseInsensetiveQuery);
            });
        }
        

        responseBooks = filteredBooks.map(book => {
            const { name, author } = book;

            return {
                name,
                author
            }
        });

        return new Response(JSON.stringify(responseBooks));
    } catch (err) {
        console.log('error on server: ', err);
    }
}
import books from '@/booksStorage/usage/storage';
import BookInterface from '@/interfaces/bookInterface';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export default async function GET(request: NextRequest) {
    const { mode, query } = request.nextUrl.searchParams as unknown as { mode: 'author' | 'name'; query: string };

    console.log(`mode: ${mode}, query: ${query}`);

    const caseInsensetiveQuery = query.toString().toLocaleLowerCase().trim();

    console.log(`queryAfterProcess: ${caseInsensetiveQuery}`);

    let data: BookInterface[] = [];

    if (mode === 'name') {
        data = books.filter(book => {
            return book.name.includes(caseInsensetiveQuery);
        });
    }
    else if (mode === 'author') {
        data = books.filter(book => {
            return book.author.includes(caseInsensetiveQuery);
        });
    }


    return NextResponse.json(data);
}
import { NextRequest, NextResponse } from 'next/server';
import { searchBooksByTitle, searchBooksByAuthor } from '@/database/db_helpers_BOOKS';
import { getAuthorDisplayName } from '@/utils/textFormat/getAuthorDisplayName';
import { SEARCH_ALL_BOOKS_URL } from '@/apiUrls';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {

    try {
        const searchParams = request.nextUrl.searchParams;

        // working on query
        const mode = searchParams.get('mode') as 'title' | 'author';
        const query = searchParams.get('query')?.trim().toLowerCase() as string;
        
        if (mode === 'title') {
            const booksByTitle = await searchBooksByTitle(query);
            
            if (!booksByTitle || booksByTitle.length === 0) {
                return NextResponse.json({ error: 'no books were found' });
            }
            
            const formattedBooks = booksByTitle.map(book => {
                const { id, title, author, rating } = book;
                
                //if author name > 10 symbols --> truncate it
                const shouldTruncate = author.name.length > 10;
                const authorDisplayName = getAuthorDisplayName(author.name, shouldTruncate);
                
                return { id, title, rating, authorDisplayName };
            });
            
            
            return NextResponse.json({ success: formattedBooks });
        }
        else {
            const authorOfBooks = await searchBooksByAuthor(query);

            if (!authorOfBooks) {
                return NextResponse.json({ error: 'no books were found' });
            }
            const formattedBooks = authorOfBooks.books.map(book => {
                const { id, title, rating } = book;

                //if author name > 10 symbols --> truncate it
                const shouldTruncate = authorOfBooks.name.length > 10;
                const authorDisplayName = getAuthorDisplayName(authorOfBooks.name, shouldTruncate);
                
                return { id, title, rating, authorDisplayName };
            });

            return NextResponse.json({ success: formattedBooks });
        }
    } catch (err) {
        console.log(`Error on endpoint: ${SEARCH_ALL_BOOKS_URL}`);
    }
}
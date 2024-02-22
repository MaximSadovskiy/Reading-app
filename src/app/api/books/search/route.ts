import { NextRequest, NextResponse } from 'next/server';
import { searchBooksByTitle, searchBooksByAuthor } from '@/lib/db_helpers_BOOKS';
import { getAuthorDisplayName } from '@/utils/textFormat/getAuthorDisplayName';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {

    try {
        const searchParams = request.nextUrl.searchParams;

        // working on query
        const mode = searchParams.get('mode') as 'title' | 'author';
        const query = searchParams.get('query')?.trim().toLowerCase() as string;
        
        if (mode === 'title') {
            const booksByTitle = await searchBooksByTitle(query);
            console.log('no books found', booksByTitle);
            if (!booksByTitle || booksByTitle.length === 0) {
                console.log('no books found');
                return NextResponse.json({ error: 'no books were found' });
            }
            const formattedBooks = booksByTitle.map(book => {
                const { id, title, author, rating } = book;
                const authorName = getAuthorDisplayName(author.name, false);
                
                return { id, title, rating, authorName };
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
                const authorName = getAuthorDisplayName(authorOfBooks.name, false)
                
                return { id, title, rating, authorName };
            });

            return NextResponse.json({ success: formattedBooks });
        }
    } catch (err) {

    }
}
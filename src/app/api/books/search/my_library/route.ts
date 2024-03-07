import { searchMyLibraryBooksByAuthor, searchMyLibraryBooksByTitle } from "@/database/db_helpers_BOOKS";
import { getCurrentUserServer } from "@/hooks/useCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import { SEARCH_MY_LIBRARY_BOOKS_URL } from "@/apiUrls";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;

        // get user
        const user = await getCurrentUserServer();

        if (!user) return NextResponse.json({ error: 'Пользователь не был найден' });

        // working on query
        const mode = searchParams.get('mode') as 'title' | 'author';
        const query = searchParams.get('query')?.trim().toLowerCase() as string;

        if (mode === 'title') {
            const libraryBooks = await searchMyLibraryBooksByTitle(query, user.id as string);
            return NextResponse.json({ success: libraryBooks });
        }
        else {
            const libraryBooks = await searchMyLibraryBooksByAuthor(query, user.id as string);
            return NextResponse.json({ success: libraryBooks });
        }
    } catch (err) {
        return NextResponse.json({ error: `Error on endpoint: ${SEARCH_MY_LIBRARY_BOOKS_URL}` });
    }
}
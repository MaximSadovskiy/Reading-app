import { NextResponse } from "next/server";
import type { CarouselBooks } from "@/booksStorage/usage/books";
import { booksInstance } from "@/booksStorage/usage/books";

export const dynamic = 'force-dynamic';

export async function GET() {

	try {
		const responseBooks: CarouselBooks = booksInstance.books.map(book => {
			const { id, title, author, rating, thumbnail } = book;

			return { id, title, author, rating, thumbnail };
		});

		return NextResponse.json(responseBooks);
	} catch (error) {
		console.log('route handler Error: ' ,error);
	}
}
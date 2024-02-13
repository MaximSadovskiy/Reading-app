import { NextResponse } from "next/server";
import type { CarouselBooks } from "@/booksStorage/usage/storage";
import { booksInstance as books } from "@/booksStorage/usage/storage";


export async function GET() {

    const initBooks = books.retrieveBooksWithoutFiles();

    const responseBooks: CarouselBooks = initBooks.map(book => {
      const { id, title, author, rating, thumbnail } = book;

      return { id, title, author, rating, thumbnail };
    });

    return NextResponse.json(responseBooks);

}
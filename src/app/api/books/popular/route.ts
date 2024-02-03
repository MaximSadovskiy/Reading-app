import { retrieveBooksWithoutFiles } from "@/booksStorage/usage/storage";
import { NextResponse } from "next/server";
import { CarouselBooks } from "@/booksStorage/usage/storage";


export async function GET() {

    const initBooks = retrieveBooksWithoutFiles();

    const responseBooks: CarouselBooks = initBooks.map(book => {
      const { id, title, author, rating, thumbnail } = book;

      return { id, title, author, rating, thumbnail };
    });

    return NextResponse.json(responseBooks);

}
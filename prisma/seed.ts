import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises"; 
//types
import { BookInterface } from "@/interfaces/storage/bookInterface";
// src
import { authorsData } from "@/booksStorage/usage/storage";

const prisma = new PrismaClient();

// main function to seed
async function main() {

    // Authors & Books
    for (const author of authorsData) {
        // await Reading Files
        const booksWithFiles = await getFilesFromPaths(author.books);  

        await prisma.author.create({
            data: {
                name: author.name,
                books: {
                    createMany: {
                        data: booksWithFiles,
                    }
                }
            }
        });
    }
}

// execution
main()

  .then(async () => {

    await prisma.$disconnect()

  })

  .catch(async (e) => {

    console.error(e)

    await prisma.$disconnect()

    process.exit(1)

  });


// helper to get files
async function getFilesFromPaths(books: BookInterface[]) {
    const booksWithFiles = await Promise.all(
        books.map(async (book) => ({
            ...book,
            file: await readFile(book.file)
        }))
    );
    return booksWithFiles;
};
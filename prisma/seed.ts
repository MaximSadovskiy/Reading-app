import { randomUUID } from "crypto";
import { PrismaClient, Comment, Like } from "@prisma/client";
import { GenreLiterals, GenreValues } from "@/interfaces/storage/bookInterface";
import { authorsData } from "@/booksStorage/textData/storage";
import { commentsData } from "@/booksStorage/textData/commentTextData";
import { usersData } from "@/booksStorage/textData/usersTextData";


const prisma = new PrismaClient();

// main function to seed
async function main() {

    // Authors & Books
    for (const author of authorsData) {
        await prisma.author.create({
            data: {
                name: author.name,
                books: {
                    createMany: {
                        data: author.books,
                    }
                }
            }
        });
    }

    // Users (не настоящие пользователи)
    const userIds = await createTestUserRecords(10);

    // Comments
    const bookGenresAndIds = await prisma.book.findMany({
        select: {
            id: true,
            genres: true,
        }
    });

    // for each book
    for await (const book of bookGenresAndIds) {
        // get random comments of length 'limit'
        const commentsIds = await createCommentRecords(10, book.id, book.genres as GenreLiterals[], userIds);


        // Likes
        // ids of the current book
        for (const commendId of commentsIds) {
            await addLikesToComment([4, 8], book.id, userIds, commendId);
        }
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



// HELPERS

// USERS
// create User records
async function createTestUserRecords(limit: number) {

    // collect userIds, to retrieve names for comments later
    const userIds: string[] = [];

    for (let i = 0; i < limit; i++) {
        const uuid = randomUUID();
        userIds.push(uuid);

        await prisma.user.create(
            {
                data: {
                    username: usersData.getRandomName(),
                    email: usersData.generateEmail(),
                    password: randomUUID(),
                    id: uuid,
                    emailVerified: new Date(),
                    favouriteGenres: getRandomFavGenres(),
                    image: '',
                    isTwoFactorEnabled: false,
                    role: 'USER',
                }
            }
        )
    }

    return userIds;
}

// favourite genres for Users
function getRandomFavGenres(limit: number = 3) {

    const favGenres: GenreLiterals[] = [];

    while (favGenres.length < limit) {
        const randomIndex = Math.floor(Math.random() * GenreValues.length);
        const randomGenre = GenreValues[randomIndex];
        if (!favGenres.includes(randomGenre)) {
            favGenres.push(randomGenre);
        } 
    }

    return favGenres;
}


// random user ID
function getRandomUserId(idArray: string[]) {
    const ind = Math.floor(Math.random() * idArray.length);
    return idArray[ind];
}

// name by ID
async function getUserNameById(userId: string) {
    const user = await prisma.user.findUnique({
        where: {id: userId},
        select: {
            username: true,
        }
    });

    return user?.username;
}

// random name
function getRandomUserName() {
    const length = usersData.names.length;
    const randomInd = Math.floor(Math.random() * length);

    return usersData.names[randomInd];
}


// COMMENTS
// create db Comment records
async function createCommentRecords(limit: number, bookId: number, genres: GenreLiterals[], userIds: string[]) {

    const genresArrLength = genres.length;
    const commentIds = [];

    let i = 0;
    while (i < limit) {
        const randomGenreInd = Math.floor(Math.random() * genresArrLength);
        const randomGenre = genres[randomGenreInd];
        // get random comment from that genre
        const content = commentsData.getRandomComment(randomGenre);
        // random userId
        const userId = getRandomUserId(userIds);
        const userName = await getUserNameById(userId);

        const commentId = randomUUID();
        commentIds.push(commentId);

        await prisma.comment.create({
            data: {
                id: commentId,
                content,
                authorId: userId,
                authorName: userName ?? getRandomUserName(),
                bookId,
                likesCount: 0,
                createdAt: getRandomDateOffset(),
            }
        });

        i++;
    }

    return commentIds;
}


// LIKES
async function addLikesToComment([minCount, maxCount]: [number, number], bookId: number, userIds: string[], commentId: string) {

    // 1 user cant like more than 1 time
    const usedIds: string[] = [];
    const randomCountOfLikes = Math.floor(Math.random() * (maxCount - minCount)) + minCount;

    let i = 0;
    while (i < randomCountOfLikes) {
        const userId = getRandomUserId(userIds);
        if (!usedIds.includes(userId)) {
            // push to prevent violation of unique constraint
            usedIds.push(userId);

            await prisma.like.create({
                data: {
                    bookId,
                    authorId: userId,
                    commentId,
                }
            });
            
            i++;
        }   
        else {
            continue;
        }
    }
} 

// get random past date
function getRandomDateOffset() {
    const now = Date.now();
    const dayToMs = 3600 * 1000 * 24;
    // 0 - 60 days away
    const randomDayCount = Math.floor(Math.random() * 60);
    const randomSeconds = Math.floor(Math.random() * 3600);

    // now - days + seconds
    const resultBackDate = now - (randomDayCount * dayToMs) + randomSeconds;
    return new Date(resultBackDate);
}

// read book files
/* async function getFilesFromPaths(books: BookInterface[]) {
    const booksWithFiles = await Promise.all(
        books.map(async (book) => ({
            ...book,
            file: await readFile(book.file)
        }))
    );
    return booksWithFiles;
}; */
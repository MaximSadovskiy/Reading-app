import { randomUUID } from "crypto";
import { PrismaClient, Comment, Like, User, Rating } from "@prisma/client";
import { GenreLiterals, GenreValues } from "@/interfaces/storage/bookInterface";
import { authorsData } from "@/booksStorage/textData/storage";
import { commentsData } from "@/booksStorage/textData/commentTextData";
import { usersData } from "@/booksStorage/textData/usersTextData";
import { updateLikesCountOfComment } from "@/database/db_helpers_BOOKS";
import { updateBookRating } from "@/database/db_helpers_BOOKS";

const prisma = new PrismaClient();

// main function to seed
async function main() {

    // Authors & Books
    for await (const author of authorsData) {
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
    const userRecordsData = getUserRecordsData(20);
    const userIds = userRecordsData.map(data => data.id);

    await prisma.user.createMany({
        data: userRecordsData
    });

    const bookGenresAndIds = await prisma.book.findMany({
        select: {
            id: true,
            genres: true,
        }
    });
    
    // for each book
    for await (const book of bookGenresAndIds) {
        // Rating
        const ratingData = getRandomRatingScores([5, 10], userIds, book.id);
        await prisma.rating.createMany({
            data: ratingData,
        });

        // update ratingScore field of book record
        await updateBookRating(book.id);

        // Comments
        // get random comments of length 'limit'
        const commentRecordsData = await getRandomCommentRecordsData([5, 15], book.id, book.genres as GenreLiterals[], userIds);
        
        const commentIds = commentRecordsData.map(data => data.id);

        await prisma.comment.createMany({
            data: commentRecordsData,
        });

        // Likes
        // ids of the current book
        for await (const commentId of commentIds) {
            const likesData = getLikesDataForComment([3, 10], book.id, userIds, commentId);

            await prisma.like.createMany({
                data: likesData,
            });

            // update likescount field on comment
            await updateLikesCountOfComment(commentId);
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
function getUserRecordsData(limit: number) {

    const users: User[] = []; 

    while (users.length < limit) {
        const user: User = {
            username: usersData.getRandomName(),
            email: usersData.generateEmail(),
            password: randomUUID(),
            id: randomUUID(),
            emailVerified: new Date(),
            favouriteGenres: getRandomFavGenres(),
            image: '',
            isTwoFactorEnabled: false,
            role: 'USER',
        }

        users.push(user);
    }

    return users;
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
type Tuple2 = [number, number];

async function getRandomCommentRecordsData([min, max]: Tuple2, bookId: number, genres: GenreLiterals[], userIds: string[]) {

    const commentRecordsData: Comment[] = [];
    const genresArrLength = genres.length;
    const randomCount = Math.floor(Math.random() * (max - min)) + min; 

    while (commentRecordsData.length < randomCount) {
        const randomGenreInd = Math.floor(Math.random() * genresArrLength);
        const randomGenre = genres[randomGenreInd];
        // get random comment from that genre
        const content = commentsData.getRandomComment(randomGenre);
        // random userId
        const userId = getRandomUserId(userIds);
        const userName = await getUserNameById(userId);

        const commentRecord: Comment = {
            id: randomUUID(),
            content,
            authorId: userId,
            authorName: userName ?? getRandomUserName(),
            bookId,
            likesCount: 0,
            createdAt: getRandomDateOffset(),
        };

        commentRecordsData.push(commentRecord);
    }

    return commentRecordsData;
}


// LIKES
function getLikesDataForComment([minCount, maxCount]: [number, number], bookId: number, userIds: string[], commentId: string) {

    const likesData: Like[] = [];
    // 1 user cant like more than 1 time
    const alreadyUsedIds: string[] = [];
    const randomCountOfLikes = Math.floor(Math.random() * (maxCount - minCount)) + minCount;

    while (likesData.length < randomCountOfLikes) {
        const userId = getRandomUserId(userIds);
        if (!alreadyUsedIds.includes(userId)) {
            // push to prevent violation of unique constraint
            alreadyUsedIds.push(userId);
            
            const like: Like = {
                bookId,
                authorId: userId,
                commentId,
            };

            likesData.push(like);
        }   
        else {
            continue;
        }
    }


    return likesData;
} 

// Rating
function getRandomRatingScores([minCount, maxCount]: Tuple2, userIds: string[], bookId: number) {

    // number of scores
    const randomCountOnScores = Math.floor(Math.random() * (maxCount - minCount)) + minCount;
    const ratingData: Rating[] = [];
    // 1 user cant add 2 rating marks
    const alreadyUsedIds: string[] = [];

    while (ratingData.length < randomCountOnScores) {
        const userId = getRandomUserId(userIds);
        // uniqueness checking
        if (!alreadyUsedIds.includes(userId)) {
             // from 5 to 10
            const ratingScore = Math.floor(Math.random() * 5) + 5;
            // random userId
            alreadyUsedIds.push(userId);

            const rating: Rating = {
                bookId,
                userId,
                ratingScore,
            }

            ratingData.push(rating);
        }
    }


    return ratingData;
}

// get random past date
function getRandomDateOffset() {
    const now = Date.now();
    const dayToMs = 3600 * 1000 * 24;
    const minuteToMs = 60 * 60 * 1000;
    // 0 - 60 days away
    const randomDayCount = Math.floor(Math.random() * 60);
    // 0 - 1000 minutes range
    const randomMinutesCount = Math.floor(Math.random() * 1000);

    // now - days + seconds
    const resultBackDate = now - (randomDayCount * dayToMs) + (randomMinutesCount * minuteToMs);

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
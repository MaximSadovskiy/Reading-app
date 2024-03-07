import { getBookById } from "@/database/db_helpers_BOOKS";
import { SingleBookSection } from "@/components/singleBookPage/SingleBook";
import styles from "@/styles/modules/singleBookPage/page.module.scss";
import type { ReturnGetBookByIdType } from "@/database/db_helpers_BOOKS";
import { getCommentsOfBookById, getNumberOfAllComments } from "@/server_actions/books_actions";
import { getCurrentUserServer } from "@/hooks/useCurrentUser";
import { ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.css';
import { getRatingScoreAction, getLibraryBookAction } from "@/server_actions/books_actions";
import type { GetRatingScore } from "@/server_actions/books_actions";
import { CommentsType } from "@/server_actions/books_actions"
import Image from "next/image";

type SingleBookProps = {
    params: { id: string },
    searchParams?: { page?: string },
}

// how many comments to take for page
const takeCommentsLimit = 4;

const SingleBookPage = async ({ params, searchParams }: SingleBookProps) => {
    const book = await getBookById(parseInt(params.id)) as NonNullable<ReturnGetBookByIdType>;

    // get Book Data (rating score) by user
    // get rating score of book by user
    const user = await getCurrentUserServer();
	let ratingScore: number | null = null;
    if (user) {
        const rating: GetRatingScore = await getRatingScoreAction(user.id as string, book.id);
        if (rating.exist) {
            ratingScore = rating.value;
        }
    }

    // fallback "NO BOOK FOUND"
    if (!book) {
        return (
            <main className={styles.main} data-empty={true}>
                <h2>
                    Сожалеем, но данная книга не была найдена, попробуйте перезагрузить страницу или обратиться в поддержку сайта :(
                </h2>
                <Image src='/emotions/sad.svg' width={150} height={150} alt="грустный смайлик" />
            </main>
        )
    }

    // get library books of user
    let isLibraryBookExist = false;
    if (user) {
        const result = await getLibraryBookAction(user.id as string, book.id);
        if (result.exist) {
            isLibraryBookExist = true;
        }
    } 

    // get first 5 comments for book with pagination
    const pageNumber = searchParams?.page ? parseInt(searchParams.page) : 1;
    const offset = (pageNumber - 1) * takeCommentsLimit;
    // log
    console.log('pageNumber: ' + pageNumber + 'offset: ' + offset);

    const commentsResult = await getCommentsOfBookById(book.id, offset, takeCommentsLimit);

    let comments: CommentsType = [];
    if (commentsResult) {
        comments = commentsResult.success;
    }

    // number of all comments to display correct pages count
    const numberOfAllComments = await getNumberOfAllComments(book.id);


    return (
        <main className={styles.main}>
            <ToastContainer 
                position='top-right'
                autoClose={1300}
            />
            <SingleBookSection 
                book={book}
                user={user}
                ratingScore={ratingScore}
                isLibBookExist={isLibraryBookExist}
                comments={comments} 
                numberOfComments={numberOfAllComments}
            />
        </main>
    )
};

export default SingleBookPage;
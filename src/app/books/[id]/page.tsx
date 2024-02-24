import { getBookById } from "@/lib/db_helpers_BOOKS";
import { SingleBookSection } from "@/components/singleBookPage/SingleBook";
import styles from "@/styles/modules/singleBookPage/page.module.scss";
import type { ReturnGetBookByIdType } from "@/lib/db_helpers_BOOKS";
import { getCommentsOfBookById } from "@/lib/db_helpers_BOOKS";
import { useCurrentUserServer } from "@/hooks/useCurrentUser";
import { ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.css';
import { getRatingScoreAction, getLibraryBookAction } from "@/server_actions/books_actions";
import type { GetRatingScore } from "@/server_actions/books_actions";
import type { CommentsType } from "@/lib/db_helpers_BOOKS";

/* 
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())
 
  return posts.map((post) => ({
    slug: post.slug,
  }))
} 
*/

type SingleBookProps = {
    params: { id: string }
}

const SingleBookPage = async ({ params }: SingleBookProps) => {
    const book = await getBookById(parseInt(params.id)) as NonNullable<ReturnGetBookByIdType>;

    // get Book Data (rating score) by user
    // get rating score of book by user
    const user = await useCurrentUserServer();
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
                <img src='/emotions/sad.svg' width={150} height={150} />
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

    // get comments for book
    const commentsResult = await getCommentsOfBookById(book.id);
    let comments: CommentsType = [];
    if (commentsResult) {
        comments = commentsResult.success;
    }


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
            />
        </main>
    )
};

export default SingleBookPage;
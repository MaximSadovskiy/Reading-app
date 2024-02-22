import { getBookById } from "@/lib/db_helpers_BOOKS";
import { SingleBookSection } from "@/components/singleBookPage/SingleBook";
import styles from "@/styles/modules/singleBookPage/page.module.scss";
import type { ReturnGetBookByIdType } from "@/lib/db_helpers_BOOKS";
import { getRatingScoreAction } from "@/server_actions/books_actions";
import type { GetRatingScoreAction } from "@/server_actions/books_actions";
import { useCurrentUserServer } from "@/hooks/useCurrentUser";
import { ToastContainer } from "react-toastify";
import 'react-toastify/ReactToastify.css';

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
    const book = await getBookById(parseInt(params.id));
    // get Book Data (rating score) by user
    // get rating score of book by user
    const user = await useCurrentUserServer();
	let ratingScore: number | null = null;
    if (user) {
        let rating: GetRatingScoreAction = await getRatingScoreAction(user.id as string, (book as NonNullable<ReturnGetBookByIdType>).id);
        if (rating.exist) {
            ratingScore = rating.value;
        }
    } 

    // fallback
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

    return (
        <main className={styles.main}>
            <ToastContainer 
                position='top-right'
                autoClose={1300}
            />
            <SingleBookSection 
                book={book as NonNullable<ReturnGetBookByIdType>}
                user={user}
                ratingScore={ratingScore} 
            />
        </main>
    )
};

export default SingleBookPage;
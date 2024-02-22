import { getBookById } from "@/lib/db_helpers_BOOKS";
import { SingleBookSection } from "@/components/singleBookPage/SingleBook";
import styles from "@/styles/modules/singleBookPage/page.module.scss";
import type { ReturnGetBookByIdType } from "@/lib/db_helpers_BOOKS";

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
            <SingleBookSection book={book as NonNullable<ReturnGetBookByIdType>} />
        </main>
    )
};

export default SingleBookPage;
import styles from "@/styles/modules/singleBookPage/comments.module.scss";
import type { CommentsType } from "@/lib/db_helpers_BOOKS";
import { AddComment } from "./client/AddComment";

interface CommentsProps {
    commentsArray: CommentsType; 
    bookTitle: string;   
}

export const Comments = ({ commentsArray, bookTitle }: CommentsProps) => {

    const renderingComments = commentsArray.map(comment => (
        <li>
            {comment.content}
        </li>
    ));

    return (
        <section className={styles.commentsSection}>
            <h2>Комментарии</h2>
            <AddComment 
                bookTitle={bookTitle}
            />
            <ul className={styles.commentList}>
                {renderingComments}
            </ul>
        </section>
    )
};
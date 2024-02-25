import styles from "@/styles/modules/singleBookPage/comments.module.scss";
import type { CommentsType } from "@/database/db_helpers_BOOKS";
import { AddComment } from "./client/AddComment";
import type { UserType } from "@/hooks/useCurrentUser";

interface CommentsProps {
    commentsArray: CommentsType; 
    bookTitle: string;
    user: UserType;
    bookId: number;   
}

export const Comments = ({ commentsArray, bookTitle, user, bookId }: CommentsProps) => {

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
                user={user}
                bookId={bookId}
            />
            <ul className={styles.commentList}>
                {renderingComments}
            </ul>
        </section>
    )
};
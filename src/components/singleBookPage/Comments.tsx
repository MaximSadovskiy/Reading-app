import styles from "@/styles/modules/singleBookPage/comments.module.scss";
import { CommentsType, getIfUserLikedComment } from "@/database/db_helpers_BOOKS";
import { AddComment } from "./client/AddComment";
import type { UserType } from "@/hooks/useCurrentUser";
import { SingleComment } from "./client/SingleComment";


interface CommentsProps {
    commentsArray: CommentsType; 
    bookTitle: string;
    user: UserType;
    bookId: number;   
}

export const Comments = ({ commentsArray, bookTitle, user, bookId }: CommentsProps) => {

    const renderingComments = commentsArray.map(async (comment) => {
        const { content, likesCount, id: commentId, authorName } = comment;
        let isLikedByUser = false;
        if (user != null) {
            isLikedByUser = await getIfUserLikedComment(user.id as string, bookId, commentId);
        }
    
        return (
            <li>
                <SingleComment 
                    content={content}
                    isLikedByUser={isLikedByUser}
                    likesCount={likesCount}
                    authorName={authorName}
                />
            </li>
        )
    });

    return (
        <section className={styles.commentsSection}>
            <h2>Комментарии</h2>
            <AddComment 
                bookTitle={bookTitle}
                user={user}
                bookId={bookId}
            />
            <span className={styles.commentLineBreak}></span>
            <ul className={styles.commentList}>
                {renderingComments}
            </ul>
        </section>
    )
};
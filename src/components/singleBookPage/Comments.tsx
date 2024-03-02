'use client';

import styles from "@/styles/modules/singleBookPage/comments.module.scss";
import { CommentsType } from "@/server_actions/books_actions";
import { AddComment } from "./client/AddComment";
import type { UserType } from "@/hooks/useCurrentUser";
import { SingleComment } from "./client/SingleComment";
import { PaginationBtns } from "./client/PaginationBtns";


interface CommentsProps {
    commentsArray: CommentsType; 
    bookTitle: string;
    user: UserType;
    bookId: number;   
}

type AuthorNameDirection = 'left' | 'right';

export const Comments = ({ commentsArray, bookTitle, user, bookId }: CommentsProps) => {

    const renderingComments = commentsArray.map((comment, index) => {
        const { content, likes, id: commentId, authorName, authorId } = comment;
        // check if user already liked a comment
        const likesCount = likes.length;
        let hasLikedByUser = false;
        if (user) {
            const likeAuthorIds = likes.map(like => like.authorId);
            hasLikedByUser = likeAuthorIds.includes(user.id as string);
        }

        // check if comment created by User
        let isCreatedByUser = false;
        if (user) {
            isCreatedByUser = authorId === user.id;   
        }

        // position of after name: 'left' | 'right'
        const authorNameDirection: AuthorNameDirection = index % 2 === 0
                                    ? 'left'
                                    : 'right';
        
        return (
            <li key={commentId}>
                <SingleComment 
                    content={content}
                    hasLikedbyUser={hasLikedByUser}
                    isCreatedByUser={isCreatedByUser}
                    likesCount={likesCount}
                    authorName={authorName}
                    bookId={bookId}
                    userId={user != null ? user.id : undefined}
                    commentId={commentId}
                    authorNameDirection={authorNameDirection}
                />
            </li>
        )
    });


    /* Pagination */
    const numberOfAllComments = commentsArray.length;

    return (
        <section className={styles.commentsSection}>
            <h2>Комментарии</h2>
            <AddComment 
                bookTitle={bookTitle}
                user={user}
                bookId={bookId}
            />
            <span className={styles.commentLineBreak}></span>
            <h3 className={styles.talkingTitle}>Обсуждение</h3>
            {renderingComments.length > 0 
                ? (
                <ul className={styles.commentList}>
                    {renderingComments}
                </ul>
            )   :   (
                <div className={styles.noCommentsBlock}>
                    <p>Кажется комментариев пока нет...</p>
                    <p>Будьте первым кто поделится своим мнением!</p>
                </div>
            )}
            <PaginationBtns 
                numberOfAllComments={numberOfAllComments}
            />
        </section>
    )
};
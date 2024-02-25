'use client';

import { memo } from "react";


interface SingleCommentProps {
    content: string;
    isLikedByUser: boolean;
    likesCount: number;
    authorName: string;
}

export const SingleComment = memo(({ content, isLikedByUser, likesCount, authorName }: SingleCommentProps) => {

    return (
        <div>
            <p>{authorName}</p>
            <p>{content}</p>
            <p>is liked by you: {isLikedByUser}</p>
            <p>likes count: {likesCount}</p>
        </div>
    )
});
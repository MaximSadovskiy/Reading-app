'use client';

import styles from "@/styles/modules/singleBookPage/addComment.module.scss";
import { useState } from "react";
import { addCommentAction, deleteCommentAction } from "@/server_actions/books_actions";

interface AddCommentProps {
    bookTitle: string;
}

export const AddComment = ({ bookTitle }: AddCommentProps) => {

    // comment text
    const [commentText, setCommentText] = useState('');
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommentText(e.target.value);
    };

    // add comment action
    const handleAddComment = async () => {
        // CONTINUE
    };

    return (
        <div className={styles.addComment}>
            <p>Как вам книга "{bookTitle}" ?</p>
            <div className={styles.inputContainer}>
                <textarea 
                    value={commentText}
                    onChange={handleInputChange}
                />
                <button>Добавить</button>
            </div>
        </div>
    )
};
'use client';

import styles from "@/styles/modules/singleBookPage/addComment.module.scss";
import { useState } from "react";
import { addCommentAction } from "@/server_actions/books_actions";
import { toast } from "react-toastify";
import type { UserType } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/shared/ConfirmModal";


interface AddCommentProps {
    bookTitle: string;
    user: UserType;
    bookId: number; 
}

export const AddComment = ({ bookTitle, user, bookId }: AddCommentProps) => {

    // comment text
    const [commentText, setCommentText] = useState('');
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCommentText(e.target.value);
    };

    // add comment action
    const handleAddComment = async () => {
        // if comment empty
        if (commentText.length <= 10) {
            toast('Слишком короткий комментарий', {
                theme: 'colored',
                type: 'error',
            });
            return;
        }
        // check if user authorized
        if (!user) {
            setIsModalOpen(true);
            return;
        }
        
        const result = await addCommentAction(commentText, user.id as string, bookId);
        if (result.error) {
            toast(result.error, {
                theme: 'colored',
                type: 'error',
            });
        }
        else if (result.success) {
            toast(result.success, {
                theme: 'colored',
                type: 'success',
            });
        }

        // reset input
        setCommentText('');
    };

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    // close modal callback
    const closeCallback = () => isModalOpen && setIsModalOpen(false);
    // redirect callback
    const router = useRouter();
    const redirectCallback = () => {
        router.push('/auth/login');
    };

    return (
        <div className={styles.addComment}>
            <p>Как вам книга &quot;{bookTitle}&quot; ?</p>
            <div className={styles.inputContainer}>
                <textarea 
                    value={commentText}
                    onChange={handleInputChange}
                />
                <button
                    onClick={handleAddComment}
                >Добавить</button>
            </div>
            {isModalOpen && (
                <ConfirmModal 
                    title="Требуется авторизацяи, перейти?"
                    activeBtnText="Перейти"
                    modalState={isModalOpen}
                    closeCallback={closeCallback}
                    activeCallback={redirectCallback}
                />
            )}
        </div>
    )
};
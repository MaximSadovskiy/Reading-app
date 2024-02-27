"use client";

import { memo, useEffect, useState } from "react";
import styles from "@/styles/modules/singleBookPage/singleComment.module.scss";
import { LikeSvg, DeleteSvg } from "@/components/shared/Svg";
import {
	addLikeAction,
	deleteCommentAction,
	removeLikeAction,
} from "@/server_actions/books_actions";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { AnimatePresence } from "framer-motion";


// TYPES
interface ModalText {
	title: string;
	btn: string;
}

const modalTexts: {
	AUTHORIZE: ModalText;
	DELETE: ModalText;
} = {
	AUTHORIZE: {
		title: 'Требуется авторизация, продолжить?',
		btn: 'Перейти'
	},
	DELETE: {
		title: 'Вы действительно хотите удалить комментарий?',
		btn: 'Удалить'
	},
}
// 2 types of modals
type ModalMods = keyof typeof modalTexts;

type ButtonMods = 'like' | 'delete';

interface BtnWithMode extends HTMLButtonElement {
	dataset: {
		mode: ButtonMods;
	}
}

interface SvgState {
	like: boolean;
	delete: boolean;
}

interface SingleCommentProps {
	content: string;
	likesCount: number;
	hasLikedbyUser: boolean;
	authorName: string;
	// for like action
	bookId: number;
	// not author of comment, but current user visited page
	// optional --> mb not authorized
	userId?: string;
	commentId: string;
	// authorName left/right position
	authorNameDirection: 'left' | 'right';
	// user - creator of the comment --> can delete it
	isCreatedByUser: boolean;
}

// COMPONENT
export const SingleComment = memo(({
	content,
	likesCount,
	authorName,
	bookId,
	userId,
	commentId,
	hasLikedbyUser,
	authorNameDirection,
	isCreatedByUser,
}: SingleCommentProps) => {

	const [isSvgLiked, setIsSvgLiked] = useState(hasLikedbyUser);
	// TEST
	useEffect(() => {
		console.log('isCreated by user: ', isCreatedByUser);
	}, []);

	// state that changes Svg bg on hover
	const [isSvgHovered, setIsSvgHovered] = useState<SvgState>({
		like: false,
		delete: false,
	});

	// HOVER STATE manipulations
	const hanldeMouseEnter = (e: React.MouseEvent) => {
		const target = e.currentTarget.closest('button[data-mode]') as BtnWithMode;
		const mode = target.dataset.mode;

		// if liked --> return
		if (mode === 'like' && isSvgLiked) return;

		if (isSvgHovered[mode] === false) {
			setIsSvgHovered({
				...(isSvgHovered as SvgState),
				[mode]: true,
			});
		}
	};

	// mouse leave
	const handleMouseLeave = (e: React.MouseEvent) => {
		const target = e.currentTarget.closest('button[data-mode]') as BtnWithMode;
		const mode = target.dataset.mode;

		// if liked --> return
		if (mode === 'like' && isSvgLiked) return;

		// if this svg hovered
		if (isSvgHovered[mode] === true) {
			setTimeout(() => setIsSvgHovered({
				...isSvgHovered,
				[mode]: false,
			}), 0);
		}
	};

	// mouse move
	const handleMouseMove = (e: React.MouseEvent) => {
		const target = e.currentTarget.closest('button[data-mode]') as BtnWithMode;
		const mode = target.dataset.mode;

		// if liked --> return
		if (mode === 'like' && isSvgLiked) return;

		if (isSvgHovered[mode] === false) {
			setIsSvgHovered({
				...(isSvgHovered as SvgState),
				[mode]: true,
			});
		}
	};

	// like action
	const handleAddLikeClick = async () => {
		if (!userId) {
			// user unauthorized
			// open modal
			setTimeout(() => {
				setModalMode('AUTHORIZE');
				setIsModalOpen(true);
			}, 0);
			return;
		}

		const result = await addLikeAction(userId, bookId, commentId);
		if (result.error) {
			toast(result.error, {
				theme: "colored",
				type: "error",
			});
		} else if (result.success) {
			toast(result.success, {
				theme: "colored",
				type: "success",
			});

			setIsSvgLiked(true);
		}
	};

	const handleRemoveLikeClick = async () => {
		if (!userId) {
			// user unauthorized
			// open modal
			setTimeout(() => {
				setModalMode('AUTHORIZE');
				setIsModalOpen(true);
			}, 0);
			return;
		}

		const result = await removeLikeAction(userId, bookId, commentId);
		if (result.error) {
			toast(result.error, {
				theme: "colored",
				type: "error",
			});
		} else if (result.success) {
			toast(result.success, {
				theme: "colored",
				type: "success",
			});

			setIsSvgLiked(false);
		}
	};

	// DELETE COMMENT
	const handleDeleteCommentClick = () => {
		// timeout to prevent batching
		setTimeout(() => {
			setModalMode('DELETE');
			setIsModalOpen(true);
		}, 0);
	};

	// modal state
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState<ModalMods>('AUTHORIZE');

	const closeCallback = () => {
		if (isModalOpen) {
			setIsModalOpen(false);
		}
	};
	// redirect modal callback
	const router = useRouter();
	const redirectCallback = () => {
		router.push("/auth/login");
	};
	// delete modal callback
	const deleteCallback = async () => {
		const result = await deleteCommentAction(commentId);
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
		// close window
		closeCallback();
	}


	return (
		<div className={styles.commentContainer}>
			<p className={styles.authorName}
				data-direction={authorNameDirection}
			>
				<span>{authorName}</span> говорит :
			</p>
			<p className={styles.commentContent}>{content}</p>
			<div className={styles.actionBtnContainer}>
				<div className={styles.commentLike}>
					<button
						onMouseEnter={hanldeMouseEnter}
						onMouseLeave={handleMouseLeave}
						onMouseMove={handleMouseMove}
						onClick={
							isSvgLiked ? handleRemoveLikeClick : handleAddLikeClick
						}
						data-mode='like'
					>
						<LikeSvg
							width={60}
							height={60}
							strokeWidth={1}
							isActive={isSvgLiked || isSvgHovered['like']}
						/>
					</button>
					<p className={styles.likesCount}>{likesCount}</p>
				</div>
				<div className={styles.commentLike}>
					<button
						onMouseEnter={hanldeMouseEnter}
						onMouseLeave={handleMouseLeave}
						onMouseMove={handleMouseMove}
						onClick={handleDeleteCommentClick}
						data-mode='delete'
					>
						<DeleteSvg 
							width={60}
							height={60}
							isActive={isSvgHovered['delete']}
						/>
					</button>
				</div>
			</div>
			<AnimatePresence>
				{isModalOpen && (
					<ConfirmModal
						modalState={isModalOpen}
						closeCallback={closeCallback}
						activeCallback={modalMode === 'AUTHORIZE'
										? redirectCallback
										: deleteCallback}
						activeBtnText={modalTexts[modalMode].btn}
						title={modalTexts[modalMode].title}
					/>
				)}
			</AnimatePresence>
		</div>
	);
});
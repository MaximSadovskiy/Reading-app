"use client";

import { memo, useState } from "react";
import styles from "@/styles/modules/singleBookPage/singleComment.module.scss";
import { LikeSvg } from "@/components/shared/Svg";


interface SingleCommentProps {
	content: string;
	isLikedByUser: boolean;
	likesCount: number;
	authorName: string;
}

export const SingleComment = memo(
	({
		content,
		isLikedByUser,
		likesCount,
		authorName,
	}: SingleCommentProps) => {
        const [isSvgLiked, setIsSvgLiked] = useState(() => isLikedByUser);

		// state that changes Svg bg on hover
		const [isSvgHovered, setisSvgHovered] = useState(false);

		// mouse enter
		const hanldeMouseEnter = () => {
            // if liked --> return
            if (isSvgLiked) return;

			if (!isSvgHovered) {
			    setisSvgHovered(true);
			}
		};

        // mouse leave
        const handleMouseLeave = () => {
            if (isSvgLiked) return;
            if (isSvgHovered) {
                setTimeout(() => setisSvgHovered(false), 0);
            }
        };

        // like action
        const handleLikeClick = async () => {

        }

		return (
			<div className={styles.commentContainer}>
				<p className={styles.authorName}>
					<span>{authorName}</span> говорит :
				</p>
				<p className={styles.commentContent}>{content}</p>
				<div className={styles.commentLike}>
                    <button>
                        <LikeSvg
                            width={60}
                            height={60}
                            strokeWidth={1}
                            isActive={isSvgHovered}
                        />
                    </button>
					<p className={styles.likesCount}>{likesCount}</p>
				</div>
				<p>is liked by you: {isLikedByUser ? "yes" : "no"}</p>
			</div>
		);
	}
);

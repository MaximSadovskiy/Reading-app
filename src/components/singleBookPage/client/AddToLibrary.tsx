"use client";

import styles from "@/styles/modules/singleBookPage/addToLibrary.module.scss";
import { CheckMarkSvgV2, SlideArrowUpgradeSvg } from "@/components/shared/Svg";
import { addBookToLibraryAction } from "@/server_actions/books_actions";
import type { UserType } from "@/hooks/useCurrentUser";
import { toast } from "react-toastify";
import { useState } from "react";

type SingleBookProps = {
	bookId: number;
	user: UserType;
};

export const AddToLibrary = ({ bookId, user }: SingleBookProps) => {
	// state flag on added or not added
	const [isAdded, setIsAdded] = useState(false);

	const handleAddLibraryClick = async () => {
		// check if authorized user
		const isAuthorized = user != undefined;
		if (!isAuthorized) {
			toast("Вы не авторизованы, войдите в аккаунт для продолжения", {
				type: "error",
				theme: "colored",
			});
			return;
		}

		const result = await addBookToLibraryAction(user.id as string, bookId);
		if (result.error) {
			toast(result.error, {
				type: "error",
				theme: "colored",
			});
		} else if (result.success) {
			toast(result.success, {
				type: "success",
				theme: "colored",
			});
            setIsAdded(true);
		}
	};

	const displayedText = isAdded
		? "Эта книга есть у вас в библиотеке"
		: "Добавить в персональную библиотеку";

	return (
		<div className={styles.wrapper}>
			<button onClick={handleAddLibraryClick}>
				<p>{displayedText}</p>
				<div className={styles.svgContainer}>
                    {isAdded == false && (
                        <SlideArrowUpgradeSvg
                            isAdded
                            width={45}
                            height={45}
                        />
                    )}
                    {isAdded == true && (
                        <CheckMarkSvgV2
                            isAdded
                            width={45}
                            height={45}
                        />
                    )}
                </div>
			</button>
		</div>
	);
};

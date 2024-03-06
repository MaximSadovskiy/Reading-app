"use client";

import Link from "next/link";
import styles from "@/styles/modules/rootLayout/accountEnter.module.scss";
// animations
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import {
	listVariants,
	itemVariants,
	listVariantsWithoutClipPath,
} from "@/animation/variants/popupLists/popupListClipped";
import { useState, useRef, useEffect, forwardRef, useCallback } from "react";
import { closeIfOutsideClick } from "@/utils/clickOutsideCloseFunction";
import { logOutAction } from "@/server_actions/general_actions";
import { UserType, useCurrentUserClient } from "@/hooks/useCurrentUser";
import { getCurrentReadBookId } from "@/server_actions/books_actions";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";


interface AccountProps {
	styleMode: 'mobile' | 'desktop';
}

const AccountEnter = ({ styleMode }: AccountProps) => {
	const [isListOpen, setIsListOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const listRef = useRef<HTMLUListElement>(null);

	// current session
	const user = useCurrentUserClient();

	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			closeIfOutsideClick<HTMLButtonElement | HTMLUListElement>(
				[buttonRef, listRef],
				e,
				() => setIsListOpen(false)
			);
		};

		document.addEventListener("click", handleOutsideClick, true);

		return () =>
			document.removeEventListener("click", handleOutsideClick, true);
	}, []);

	// open List of options
	const listOpenHandler = () => {
		setIsListOpen(!isListOpen);
	};

	const closePopupList = useCallback(() => {
		if (isListOpen == true) {
			setIsListOpen(false);
		}
	}, [isListOpen]);

	return (
		<div aria-labelledby="account-label" className={styles.outerContainer}
			data-orientation={styleMode}
		>
			<div className={styles.innerContainer}
				data-orientation={styleMode}
			>
				<LazyMotion features={domAnimation}>
					<m.button
						className={styles.openBtn}
						onClick={listOpenHandler}
						data-open={isListOpen}
						ref={buttonRef}
						data-orientation={styleMode}
						variants={styleMode === 'mobile' ? itemVariants : listVariantsWithoutClipPath}
					>
						<img
							src="/account-enter.svg"
							alt=""
							role="presentation"
							width={35}
							height={35}
						/>
						<p id="account-label">Аккаунт</p>
					</m.button>
					{styleMode === 'desktop' && (
							<AnimatePresence>
								{isListOpen && (
									<PopupList
										ref={listRef}
										closePopupList={closePopupList}
										orientation={styleMode}
										user={user}
									/>
								)}
							</AnimatePresence>
					)}
				</LazyMotion>
			</div>
			{styleMode === 'mobile' && (
				<LazyMotion features={domAnimation}>
					<AnimatePresence>
						{isListOpen && (
							<PopupList
								ref={listRef}
								closePopupList={closePopupList}
								user={user}
								orientation={styleMode}
							/>
						)}
					</AnimatePresence>
				</LazyMotion>
			)}					
		</div>
	);
};

export default AccountEnter;

type PopupProps = {
	user: UserType;
	closePopupList: () => void;
	orientation: 'mobile' | 'desktop';
};

const PopupList = forwardRef(
	({ user, closePopupList, orientation }: PopupProps, ref: React.Ref<HTMLUListElement>) => {

	const handleLogoutClick = async () => {
		await logOutAction('/');
		closePopupList();
	};

	const handleUrlTransition = () => {
		closePopupList();
	};

	// to current Reading book
	const router = useRouter();

	const handleCurrentBookTransition = async () => {
		if (user?.id) {
			const result = await getCurrentReadBookId(user.id);
			if (result.error) {
				toast(result.error, {
					theme: 'colored',
					type: 'error',
				});
				closePopupList();
				return;
			}
			else {
				// if have book --> redirect
				closePopupList();
				router.push(`/read/${result.success}`);
			}
		}
	};

	return (
		<>
			<m.ul
				className={styles.popupList}
				variants={orientation === 'desktop' ? listVariants : listVariantsWithoutClipPath}
				exit="exit"
				initial="initial"
				animate="animate"
				id="open-list"
				aria-live="polite"
				aria-labelledby="account-info"
				role="listbox"
				ref={ref}
				data-orientation={orientation}
			>
				{user == null && (
					<>
						<m.li
							className={styles.popupListItem}
							role="option"
							variants={itemVariants}
						>
							<Link
								onClick={handleUrlTransition}
								href="/auth/register"
								data-first
							>
								Регистрация
							</Link>
						</m.li>
						<m.li
							className={styles.popupListItem}
							role="option"
							variants={itemVariants}
						>
							<Link onClick={handleUrlTransition} href="/auth/login">
								Войти
							</Link>
						</m.li>
					</>
				)}
				{user != null && (
					<>
						<m.li
							className={styles.popupListItem}
							role="option"
							variants={itemVariants}
						>
							<Link onClick={handleUrlTransition} href="/my_library">
								Моя библиотека
							</Link>
						</m.li>
						<m.li
							className={styles.popupListItem}
							role="option"
							variants={itemVariants}
						>
							<button onClick={handleCurrentBookTransition}>
								Читальный зал
							</button>
						</m.li>
						{/* Sign out action */}
						<m.li
							className={styles.popupListItem}
							role="option"
							variants={itemVariants}
							data-last
						>
							<button onClick={handleLogoutClick}>Выйти</button>
						</m.li>
					</>
				)}
			</m.ul>
			<p id="account-info" className="sr-only">
				Выбор действия связанного с аккаунтом
			</p>
		</>
	);
});

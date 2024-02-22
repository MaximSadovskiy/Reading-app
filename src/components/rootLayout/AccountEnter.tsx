"use client";

import Link from "next/link";
import styles from "@/styles/modules/rootLayout/accountEnter.module.scss";
// animations
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import {
	listVariants,
	itemVariants,
} from "@/animation/variants/popupLists/popupListClipped";
import { useState, useRef, useEffect, forwardRef, useCallback } from "react";
import { closeIfOutsideClick } from "@/utils/clickOutsideCloseFunction";
import { logOutAction } from "@/server_actions/general_actions";
import { useCurrentUserClient } from "@/hooks/useCurrentUser";


const AccountEnter = () => {
	const [isListOpen, setIsListOpen] = useState(false);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const listRef = useRef<HTMLUListElement>(null);

	// current session
	const user = useCurrentUserClient();
	const isAuthorized = user != null;

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
		<div aria-labelledby="account-label" className={styles.outerContainer}>
			<div className={styles.innerContainer}>
				<button
					className={styles.openBtn}
					onClick={listOpenHandler}
					data-open={isListOpen}
					ref={buttonRef}
				>
					<img
						src="/account-enter.svg"
						alt=""
						role="presentation"
						width={35}
						height={35}
					/>
					<p id="account-label">Аккаунт</p>
				</button>
				<LazyMotion features={domAnimation}>
					<AnimatePresence>
						{isListOpen && (
							<PopupList
								ref={listRef}
								closePopupList={closePopupList}
								isAuthorized={isAuthorized}
							/>
						)}
					</AnimatePresence>
				</LazyMotion>
			</div>
		</div>
	);
};

export default AccountEnter;

type PopupProps = {
	isAuthorized: boolean;
	closePopupList: () => void;
};

const PopupList = forwardRef(
	({ isAuthorized, closePopupList }: PopupProps, ref: React.Ref<HTMLUListElement>) => {
		const handleLogoutClick = async () => {
			await logOutAction('/');
			closePopupList();
		};

		const handleUrlTransition = () => {
			closePopupList();
		};

		return (
			<>
				<m.ul
					className={styles.popupList}
					variants={listVariants}
					exit="exit"
					initial="initial"
					animate="animate"
					id="open-list"
					aria-live="polite"
					aria-labelledby="account-info"
					role="listbox"
					ref={ref}
				>
					{isAuthorized == false && (
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
					{isAuthorized == true && (
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
								<Link onClick={handleUrlTransition} href="/read">
									Читальный зал
								</Link>
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
	}
);

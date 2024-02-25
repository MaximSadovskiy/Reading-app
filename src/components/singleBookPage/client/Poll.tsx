"use client";

import { useState } from "react";
import { StarSvg } from "@/components/shared/Svg";
import styles from "@/styles/modules/singleBookPage/poll.module.scss";
import debounce from "@/utils/debounceDecorator";
import {
	Variants,
	AnimatePresence,
	LazyMotion,
	domAnimation,
	m,
} from "framer-motion";
import {
	rateBookAction,
	unrateBookAction,
} from "@/server_actions/books_actions";
import { toast } from "react-toastify";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { useRouter } from "next/navigation";
import type { UserType, UserNoNullType } from "@/hooks/useCurrentUser";

type IsHoveredState = {
	[ind: number | string]: boolean;
};

type ObjectWithNumberIndex = {
	[ind: number]: string;
};

const textOnEachRate = {
	0: "Паршиво.",
	1: "Ужасно.",
	2: "Очень плохо.",
	3: "Плохо.",
	4: "Не стоило того...",
	5: "Середнячок...",
	6: "Довольно неплохо...",
	7: "Хорошо!",
	8: "Отлично!",
	9: "Великолепно!",
};

const emojiSrcOnRate = {
	bad: "/emotions/sad.svg",
	medium: "/emotions/happy.svg",
	good: "/emotions/loading.svg",
};

interface PollProps {
	bookId: number;
	user: UserType;
	ratingScore: number | null;
}

export const Poll = ({ bookId, user, ratingScore }: PollProps) => {
	// if user already rates book
	const [hasRatedByUser, setHasRatedByUser] = useState(
		ratingScore !== null ? true : false
	);
	// hover states
	// most significant hovered item, to pass to RateDescription
	const [lastHoveredItemIndex, setLastHoveredItemIndex] = useState(0);
	const [isULHovered, setIsULHovered] = useState(false);
	const [isHoveredItem, setIsHoveredItem] = useState<IsHoveredState>({
		0: false,
		1: false,
		2: false,
		3: false,
		4: false,
		5: false,
		6: false,
		7: false,
		8: false,
		9: false,
	});

	// mouse leave on Whole List
	const hanldeMouseLeaveList = (e: React.MouseEvent) => {
		const relatedTarget = e.relatedTarget;

		if (
			relatedTarget instanceof HTMLLIElement == false ||
			relatedTarget instanceof SVGAElement == false
		) {
			setTimeout(() => {
				const newHovered = Object.keys(
					isHoveredItem
				).reduce<IsHoveredState>((acc, key) => {
					acc[key] = false;
					return acc;
				}, {});

				setIsHoveredItem(newHovered);
				setIsULHovered(false);
			}, 150);
		}
	};

	// mouse events on ITEMS

	// mouse move ITEM
	const handleMouseMoveItem = debounce((itemIndex: number) => {
		// if it already hovered --> exit event
		if (isHoveredItem[itemIndex] == true) return;
		// if we inside element, and it is somehow not already HOVERED
		else {
			const newHoveredState = Object.keys(
				isHoveredItem
			).reduce<IsHoveredState>((acc, key, index) => {
				if (index <= itemIndex) {
					acc[key] = true;
					return acc;
				} else {
					acc[key] = false;
					return acc;
				}
			}, {});

			setIsHoveredItem(newHoveredState);
			if (!isULHovered) setIsULHovered(true);
		}
	}, 100);

	// mouse enter ITEM
	const handleMouseEnterItem = (itemIndex: number) => {
		const newHoveredState = Object.keys(
			isHoveredItem
		).reduce<IsHoveredState>((acc, key, index) => {
			if (index <= itemIndex) {
				acc[key] = true;
				return acc;
			} else {
				acc[key] = false;
				return acc;
			}
		}, {});

		setIsHoveredItem(newHoveredState);
		setLastHoveredItemIndex(itemIndex);
		if (!isULHovered) setIsULHovered(true);
	};

	// mouse leave ITEM
	const handleMouseLeaveItem = (e: React.MouseEvent, itemIndex: number) => {
		const relatedTarget = e.relatedTarget;

		if (relatedTarget instanceof HTMLUListElement) {
			return;
		}

		setTimeout(() => {
			setIsHoveredItem({
				...isHoveredItem,
				[itemIndex]: false,
			});
		}, 0);
	};

	//RATE Book logic
	// modal state, to adress user to login page if !authorized
	const [isModalOpen, setIsModalOpen] = useState(false);
	// modal close callback
	const closeModal = () => {
		if (isModalOpen) {
			setIsModalOpen(false);
		}
	};
	// redirect for modal
	const router = useRouter()
	const redirectCallback = () => {
		router.push("/auth/login");
	}
	
	// Click handler when user Rates book
	const handleRateClick = async (itemIndex: number) => {
		// if no user authorized --> open modal
		if (!user) {
			setIsModalOpen(true);
			return;
		}
		// user already rated book
		else if (hasRatedByUser) {
			return;
		}
		// user authorized --> do rate action
		else {
			const ratingScore = itemIndex + 1;
			const result = await rateBookAction(
				ratingScore,
				user.id as string,
				bookId
			);
			if (result.error) {
				toast(result.error, {
					type: 'error',
					theme: 'colored',
				});
			}
			else if (result.success) {
				toast(result.success, {
					type: 'success',
					theme: 'colored',
				});
				setHasRatedByUser(true);
				setIsULHovered(false);
			}
		}
	};

	const listOfStars = new Array(10).fill(0).map((el, index) => {
		let isHovered: boolean = false;
		if (hasRatedByUser && ratingScore) {
			if (index < ratingScore) {
				isHovered = true;
			}
		} else {
			isHovered = isHoveredItem[index];
		}

		return (
			<li
				key={index}
				onClick={() => handleRateClick(index)}
				onMouseMove={() => handleMouseMoveItem(index)}
				onMouseEnter={() => handleMouseEnterItem(index)}
				onMouseLeave={(e) => handleMouseLeaveItem(e, index)}
			>
				<StarSvg width={50} height={50} isHoveredItem={isHovered} />
			</li>
		);
	});

	// rating text
	const ratingText =
		hasRatedByUser && ratingScore ? "Вы оценили как :" : "Оценить книгу :";
	// cancel rating score
	const handleUnrateBook = async () => {
		const result = await unrateBookAction(
			(user as UserNoNullType).id as string,
			bookId
		);
		if (result.error) {
			toast(result.error, {
				type: "error",
				theme: "colored",
			});
		} else {
			toast(result.success, {
				type: "success",
				theme: "colored",
			});
		}

		// reset hasRated state
		setHasRatedByUser(false);
		// reset Hover state
		const newIsHovered = Object.keys(isHoveredItem).reduce<IsHoveredState>((acc, key) => {
			acc[key] = false;
			return acc;
		}, {});
		setIsHoveredItem(newIsHovered);
	};

	return (
		<div className={styles.pollWrapper}>
			<p>{ratingText}</p>
			<ul onMouseLeave={(e) => hanldeMouseLeaveList(e)}>{listOfStars}</ul>
			<LazyMotion features={domAnimation}>
				<AnimatePresence>
					{(hasRatedByUser && ratingScore) ? (
						<RateDescription 
							key="rateDesc"
							itemIndex={ratingScore - 1}
						/>
					) : (isULHovered) && (
						<RateDescription 
							key="rateDesc"
							itemIndex={lastHoveredItemIndex}
						/>
					)}
					{isModalOpen && (
						<ConfirmModal
							title='Требуется авторизация, продолжить?'
							modalState={isModalOpen}
							closeCallback={closeModal}
							redirectCallback={redirectCallback}
						/>
					)}
					{hasRatedByUser ? (
						<m.button
							key="canccelRateBtn"
							className={styles.rateCancelBtn}
							onClick={handleUnrateBook}
							exit={{
								opacity: 0,
								scale: 0,
								transition: {
									duration: 0.4,
								}
							}}
						>
							Отменить оценку?
						</m.button>
					) : (
						// placeholder
						<div aria-hidden className={styles.rateBtnPlaceholder}></div>
					)}
				</AnimatePresence>
			</LazyMotion>
		</div>
	);
};

// Description when user hovers under rating marks
type RateDescriptionProps = {
	itemIndex: number;
};

const RateDescVariants: Variants = {
	initial: {
		opacity: 0,
		scale: 0,
	},
	animate: {
		opacity: [0, 0.7, 1],
		scale: [0, 1.2, 1],
		transition: {
			type: "spring",
			duration: 1,
		},
	},
	exit: {
		opacity: [1, 0.7, 0],
		scale: [1, 1.2, 0],
		transition: {
			type: "spring",
			duration: 1,
		},
	},
};

const RateDescription = ({ itemIndex }: RateDescriptionProps) => {
	let rateText: string;
	let rateEmojiSrc: string;

	// text
	rateText = (textOnEachRate as ObjectWithNumberIndex)[itemIndex];

	// emoji
	if (itemIndex <= 4) {
		rateEmojiSrc = emojiSrcOnRate.bad;
	} else if (itemIndex <= 6) {
		rateEmojiSrc = emojiSrcOnRate.medium;
	} else {
		rateEmojiSrc = emojiSrcOnRate.good;
	}

	return (
		<m.div
			className={styles.rateDesc}
			variants={RateDescVariants}
			animate="animate"
			initial="initial"
			exit="exit"
		>
			<p>{rateText}</p>
			<img src={rateEmojiSrc} width={70} height={70} />
		</m.div>
	);
};
"use client";

import { useRef, useState } from "react";
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
import { useCurrentUserClient } from "@/hooks/useCurrentUser";
import useModal from "@/hooks/useModal";
import getModalBlurVariants from "@/animation/variants/modalBlurVariants";
import Backdrop from "@/components/shared/Backdrop";
import { rateBookAction } from "@/server_actions/books_actions";
import { useRouter } from "next/navigation";


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
    bookId: number
}

export const Poll = ({ bookId }: PollProps) => {

    // get user from Session
    const user = useCurrentUserClient();
	const [isULHovered, setIsULHovered] = useState(false);
	// most significant hovered item, to pass to RateDescription
	const [lastHoveredItemIndex, setLastHoveredItemIndex] = useState(0);
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
    const closeModal = () => {
        if (isModalOpen) {
            setIsModalOpen(false);
        }
    };
    // Click handler when user Rates book
    const handleRateClick = async (itemIndex: number) => {
        // if no user authorized --> open modal
        if (!user) {
            setIsModalOpen(true);
            return;
        } 
        // user authorized --> do rate action
        else {
			const ratingScore = itemIndex + 1;
            await rateBookAction(ratingScore, user.id as string, bookId);
        }
    };

	const listOfStars = new Array(10).fill(0).map((el, index) => {
		return (
			<li
				key={index}
				onMouseMove={() => handleMouseMoveItem(index)}
				onMouseEnter={() => handleMouseEnterItem(index)}
				onMouseLeave={(e) => handleMouseLeaveItem(e, index)}
			>
				<StarSvg
					width={50}
					height={50}
					isHoveredItem={isHoveredItem[index]}
				/>
			</li>
		);
	});

	return (
		<div className={styles.pollWrapper}>
			<ul onMouseLeave={(e) => hanldeMouseLeaveList(e)}>{listOfStars}</ul>
			<LazyMotion features={domAnimation}>
				<AnimatePresence>
					{isULHovered && (
						<RateDescription itemIndex={lastHoveredItemIndex} />
					)}
                    {isModalOpen && (
                        <>
                            <ConfirmModal 
                                closeCallback={closeModal}
                                modalState={isModalOpen}
                            />
                            <Backdrop />
                        </>
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
		opacity: [0, 1, 1],
		scale: [0, 1.2, 1],
		transition: {
			type: "spring",
			duration: 1,
		},
	},
	exit: {
		opacity: 0,
		scale: 0,
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

// Modal to confirm transition to Login page
type ConfirmModalProps = {
    closeCallback: () => void;
    modalState: boolean;
}

const ConfirmModal = ({ closeCallback, modalState }: ConfirmModalProps) => {
    
	const modalRef = useRef<HTMLDivElement>(null);
    useModal(modalRef, closeCallback, modalState);
	
	const router = useRouter();
	const handleTransitionClick = () => {
		router.push('/auth/login');
	};

    return (
        <m.div ref={modalRef}
            className={styles.confirmModal}
            variants={getModalBlurVariants('15px')}
            initial='initial'
            animate='animate'
            exit='exit'

            key='transitionURLmodal'
        >
            <button
				onClick={handleTransitionClick}
			>Перейти</button>
            <button
				onClick={closeCallback}
			>Отмена</button>
        </m.div>
    )
};
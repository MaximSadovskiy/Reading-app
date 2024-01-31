'use client';

import { CarouselBooks } from "@/booksStorage/usage/storage";
import BookCard from "../client/SingleBookCard";
import SlideBtn from "../client/SlideBtn";
import styles from '@/styles/modules/booksPage/bookCarousel.module.scss';
// animation
import { useAnimate, useMotionValue, m, LazyMotion, domAnimation } from "framer-motion";
import { getScrollDistanceOnBreakpoint, getCurrentVisibleDistance } from "@/hooks/useSlideContainer";
import { useState } from "react";

// types
type Title = 'Популярные книги' | 'Новое';
interface CarouselProps {
    title: Title;
    books: CarouselBooks;
}

// server component
const BookCarousel = ({ title, books }: CarouselProps) => {

    const renderBooks = books.map(book => <BookCard key={book.id} book={book} />);

    /* Carousel Logic */
    const currentScrollValue = useMotionValue(0);
    const [isPrevBtnDisabled, setIsPrevBtnDisabled] = useState(true);
    const [isNextBtnDisabled, setIsNextBtnDisabled] = useState(false);

    const [scope, animate] = useAnimate<HTMLUListElement>();

    // helper values
    const cardCount = renderBooks.length;
    const cardWidth = 220;
    const gapWidth = 20;

    /* EVENT HANDLERS (on BTNs) */
    const handlePrevClick = () => {
        const windowWidth = document.documentElement.clientWidth;
        /* желаемая дистанция скролла (зависит от ширины окна) */
        const wantToScrollDistance = Math.abs(getScrollDistanceOnBreakpoint(windowWidth, cardWidth, gapWidth));
        /* текущая дистанция скролла */
        const currentScrollDistance = Math.abs(currentScrollValue.get());

        if (wantToScrollDistance > currentScrollDistance) {
            if (currentScrollDistance !== 0) {
                /* scroll to 0 */
                const distanceToScroll = 0;
                animate(currentScrollValue, distanceToScroll, { type: 'spring', ease: 'circOut', duration: 1, damping: 15, stiffness: 60 });

                if (!isPrevBtnDisabled) setIsPrevBtnDisabled(true);
            }
            /* scroll == 0, do not scroll back, return */
            else {
                return;
            }
        }
        /* not edge case, just scroll */
        else {
            const distanceToScroll = -(currentScrollDistance - wantToScrollDistance);
            animate(currentScrollValue, distanceToScroll, { type: 'spring', ease: 'circOut', duration: 1, damping: 15, stiffness: 60 });

            if (isNextBtnDisabled) setIsNextBtnDisabled(false);
            if (!isPrevBtnDisabled && currentScrollValue.get() === 0) {
                setIsPrevBtnDisabled(true);
            }
        }
    };


    const handleNextClick = () => {
        const windowWidth = document.documentElement.clientWidth;
        const gapCount = cardCount - 1;
        /* дистанция для кард, видимых на экране (внутри лист-контейнера) */
        const visibleCardDistance = getCurrentVisibleDistance(windowWidth, cardWidth, gapWidth);
        /* максимальная дистанция которую охватывают все карточки (учитывая видимые) */
        const wholeDistanceWithVisibleCards = (cardCount * cardWidth) + (gapCount * gapWidth);
        /* дистанция для скролла, не включая уже видимые карточки в контейнере */
        let maxScrollDistance = wholeDistanceWithVisibleCards - visibleCardDistance;
        /* желаемая дистанция скролла (зависит от ширины окна) */
        const wantToScrollDistance = Math.abs(getScrollDistanceOnBreakpoint(windowWidth, cardWidth, gapWidth));
        /* текущая дистанция скролла */
        const currentScrollDistance = Math.abs(currentScrollValue.get());
        

        if (wantToScrollDistance > maxScrollDistance - currentScrollDistance) {
            if (currentScrollDistance !== maxScrollDistance) {

                /* scroll to maxDistance */
                const scrollDistance = -maxScrollDistance;
                animate(currentScrollValue, scrollDistance, { type: 'spring', ease: 'circOut', duration: 1, damping: 15, stiffness: 60 });

                if (!isNextBtnDisabled) setIsNextBtnDisabled(true);
            }
            /* scroll == maxDistance, do not scroll forward, return */
            else {
                return;
            }
        }
        /* not edge case, just scroll */
        else {
            const scrollDistance = -(currentScrollDistance + wantToScrollDistance);
            animate(currentScrollValue, scrollDistance, { type: 'spring', ease: 'circOut', duration: 1, damping: 15, stiffness: 60 });

            if (isPrevBtnDisabled) setIsPrevBtnDisabled(false);
            if (!isNextBtnDisabled && Math.abs(currentScrollValue.get()) === maxScrollDistance) setIsNextBtnDisabled(true);
        }
    };


    return (
        <section className={styles.popularSection}>
            <h2 className={styles.popularTitle}>{title}</h2>

            {/* prev slide button controller */}
            <SlideBtn direction="left" handleClick={handlePrevClick} isDisabled={isPrevBtnDisabled} />

            {/* main animated list */}
            <div className={styles.popularContainer}>
                <LazyMotion features={domAnimation}>
                    <m.ul className={styles.popularList}
                        ref={scope}
                        style={{
                            x: currentScrollValue
                        }}
                    >
                        {renderBooks}
                    </m.ul>
                </LazyMotion>
            </div>

            {/* next slide button controller */}
            <SlideBtn direction="right" handleClick={handleNextClick} isDisabled={isNextBtnDisabled} />

        </section>
    )
};


export default BookCarousel;
'use client';

import { CarouselBooks } from "@/booksStorage/usage/storage";
import BookCard from "../client/SingleBookCard";
import SlideBtn from "../client/SlideBtn";
import styles from '@/styles/modules/booksPage/bookCarousel.module.scss';
// animation
import { useAnimate, useMotionValue, useMotionValueEvent, m, LazyMotion, domAnimation } from "framer-motion";
import { getScrollDistanceOnBreakpoint, getCurrentVisibleDistance, getMaxScrollDistance, getPerspectiveOriginCenter } from "@/utils/carouselUtils";
import { useState, useRef } from "react";

// types
type Title = 'Популярные книги' | 'Новое';
interface CarouselProps {
    title: Title;
    books: CarouselBooks;
}

// server component
const BookCarousel = ({ title, books }: CarouselProps) => {

    /* Perspective for animations */
    const perspectiveOriginValue = useMotionValue<string>('20%');

    const renderBooks = books.map(book => <BookCard key={book.id} book={book} perspectiveOriginValue={perspectiveOriginValue} />);

    /* Carousel Logic */
    const currentScrollValue = useMotionValue(0);
    const [isPrevBtnDisabled, setIsPrevBtnDisabled] = useState(true);
    const [isNextBtnDisabled, setIsNextBtnDisabled] = useState(false);

    const [scope, animate] = useAnimate<HTMLUListElement>();

    // helper values
    const cardCount = renderBooks.length;
    const cardWidthRef = useRef<number>(220);
    const gapWidthRef = useRef<number>(35);
    

    /* Event for perspective update */
    useMotionValueEvent(currentScrollValue, 'animationComplete', () => {
        const windowWidth = document.documentElement.clientWidth;
        
        //log
        console.log(`bookCar MotionEvent_complete, cardWidth: ${cardWidthRef.current}`);

        const updatedValue = getPerspectiveOriginCenter(
            windowWidth, 
            currentScrollValue.get(),
            cardWidthRef.current,
            gapWidthRef.current,
        );

        perspectiveOriginValue.set(updatedValue); 
    });


    /* Event which disables buttons, when certain values of "currentScrollValue" achieved */
    useMotionValueEvent(currentScrollValue, 'change', (latestValue) => {
        /* PREV button state */
        if ((latestValue <= 0 && latestValue > -50) && !isPrevBtnDisabled) {
            setIsPrevBtnDisabled(true);
        }

        else if ((latestValue < -50) && isPrevBtnDisabled) {
            setIsPrevBtnDisabled(false);
        }
        
        /* NEXT button state */
        const windowWidth = document.documentElement.clientWidth;
        const maxScrollDistance = -getMaxScrollDistance(windowWidth, cardCount, cardWidthRef.current, gapWidthRef.current);

        /* if its === maxScrollDist disable NEXT button */
        if ((latestValue >= maxScrollDistance && (latestValue < maxScrollDistance + 20)) && !isNextBtnDisabled) {
            setIsNextBtnDisabled(true);
        }

        else if ((latestValue > maxScrollDistance + 20) && isNextBtnDisabled) {
            setIsNextBtnDisabled(false);
        }
    });


    /* EVENT HANDLERS (on BTNs) */
    const handlePrevClick = () => {
        const windowWidth = document.documentElement.clientWidth;

         //log
         console.log(`bookCar handlePrevClick, cardWidth: ${cardWidthRef.current}`);
        /* желаемая дистанция скролла (зависит от ширины окна) */
        const wantToScrollDistance = Math.abs(getScrollDistanceOnBreakpoint(windowWidth, cardWidthRef.current, gapWidthRef.current));
        /* текущая дистанция скролла */
        const currentScrollDistance = Math.abs(currentScrollValue.get());

        if (wantToScrollDistance > currentScrollDistance) {
            if (currentScrollDistance !== 0) {
                /* scroll to 0 */
                const distanceToScroll = 0;
                animate(currentScrollValue, distanceToScroll, { type: 'spring', ease: 'circOut', duration: 0.95 });
            }
            /* scroll == 0, do not scroll back, return */
            else {
                return;
            }
        }
        /* not edge case, just scroll */
        else {
            const distanceToScroll = -(currentScrollDistance - wantToScrollDistance);
            animate(currentScrollValue, distanceToScroll, { type: 'spring', ease: 'circOut', duration: 0.95 });
        }
    };


    const handleNextClick = () => {
        const windowWidth = document.documentElement.clientWidth;

        const gapCount = cardCount - 1;

        //log
        console.log(`bookCar handleNextClick, cardWidth: ${cardWidthRef.current}`);
        /* дистанция для кард, видимых на экране (внутри лист-контейнера) */
        const visibleCardDistance = getCurrentVisibleDistance(windowWidth, cardWidthRef.current, gapWidthRef.current);
        /* максимальная дистанция которую охватывают все карточки (учитывая видимые) */
        const wholeDistanceWithVisibleCards = (cardCount * cardWidthRef.current) + (gapCount * gapWidthRef.current);
        /* дистанция для скролла, не включая уже видимые карточки в контейнере */
        let maxScrollDistance = wholeDistanceWithVisibleCards - visibleCardDistance;
        /* желаемая дистанция скролла (зависит от ширины окна) */
        const wantToScrollDistance = Math.abs(getScrollDistanceOnBreakpoint(windowWidth, cardWidthRef.current, gapWidthRef.current));
        /* текущая дистанция скролла */
        const currentScrollDistance = Math.abs(currentScrollValue.get());
        

        if (wantToScrollDistance > maxScrollDistance - currentScrollDistance) {
            if (currentScrollDistance !== maxScrollDistance) {
                /* scroll to maxDistance */
                const scrollDistance = -maxScrollDistance;
                animate(currentScrollValue, scrollDistance, { type: 'spring', ease: 'circOut', duration: 0.95 });
            }
            /* scroll == maxDistance, do not scroll forward, return */
            else {
                return;
            }
        }
        /* not edge case, just scroll */
        else {
            const scrollDistance = -(currentScrollDistance + wantToScrollDistance);
            animate(currentScrollValue, scrollDistance, { type: 'spring', ease: 'circOut', duration: 0.95 });
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
                            x: currentScrollValue,
                            perspectiveOrigin: perspectiveOriginValue,
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
'use client';

import BookCard from "./SingleBookCard";
import SlideBtn from "./SlideBtn";
import styles from '@/styles/modules/booksPage/bookCarousel.module.scss';
// animation
import { useAnimate, useMotionValue, useMotionValueEvent, m, LazyMotion, domAnimation } from "framer-motion";
import { getScrollDistanceOnBreakpoint, getCurrentVisibleDistance, getMaxScrollDistance, getPerspectiveOriginCenter, isShouldScroll } from "@/utils/carouselUtils";
import { useState, useRef, useEffect } from "react";
// type ob Book
import type { CarouselBooks } from "@/server_actions/books_actions";

// types
interface CarouselProps {
    title: string;
    books: CarouselBooks;
    genreDescription: string;
}

type TimerType = ReturnType<typeof setTimeout>

// server component
const BookCarousel = ({ title, books, genreDescription }: CarouselProps) => {

    /* Perspective for animations */
    const perspectiveOriginValue = useMotionValue<string>('150px');

    const currentScrollValue = useMotionValue(0);

    const cardWidthRef = useRef<number>(230);
    const gapWidthRef = useRef<number>(35);
    // timerRef (общая для всех кард) to reset / stopReset perspective
    const timerRef = useRef<number | null>(null);

    /* effect for setting initial value */
    useEffect(() => {

        const windowWidth = document.documentElement.clientWidth;
        const initialPerspectiveValue = getPerspectiveOriginCenter(windowWidth, currentScrollValue.get(), cardWidthRef.current, gapWidthRef.current);

        perspectiveOriginValue.set(initialPerspectiveValue);
    
    }, []);

    const renderBooks = books.map(book => (
        <BookCard key={book.id} 
            book={book} 
            perspectiveOriginValue={perspectiveOriginValue} 
            currentScrollValue={currentScrollValue} 
            cardWidth={cardWidthRef.current} 
            gapWidth={gapWidthRef.current}
            timerRef={timerRef}
        />)
    );

    // helper values
    const cardCount = renderBooks.length;

    /* Btns disabling / enabling */
    const [isPrevBtnDisabled, setIsPrevBtnDisabled] = useState(true);
    const [isNextBtnDisabled, setIsNextBtnDisabled] = useState(false);

    const [scope, animate] = useAnimate<HTMLUListElement>();

    const resizeTimerRef = useRef<TimerType | null>(null);

    // resize init effect (set NEXT to disable if needed)
    // resize listener (set NEXT to disable if needed)
    useEffect(() => {
        if (resizeTimerRef.current !== null) {
            clearTimeout(resizeTimerRef.current);
            resizeTimerRef.current = null;
        }

        resizeTimerRef.current = setTimeout(() => {

            const windowWidth = document.documentElement.clientWidth;
            const shouldScroll = isShouldScroll(windowWidth, cardCount);

            if (!shouldScroll) {
                setTimeout(() => setIsNextBtnDisabled(true), 0);
            }
            else {
                setTimeout(() => setIsNextBtnDisabled(false), 0);
            }
        }, 200);
    }, []);

    useEffect(() => {
        const isShouldScrollHandler = () => {
            if (resizeTimerRef.current !== null) {
                clearTimeout(resizeTimerRef.current);
                resizeTimerRef.current = null;
            }

            resizeTimerRef.current = setTimeout(() => {

                const windowWidth = document.documentElement.clientWidth;
                const shouldScroll = isShouldScroll(windowWidth, cardCount);

                if (!shouldScroll) {
                    setTimeout(() => setIsNextBtnDisabled(true), 0);
                }
                else {
                    setTimeout(() => setIsNextBtnDisabled(false), 0);
                }
            }, 200);
        };
        

        window.addEventListener('resize', isShouldScrollHandler);

        return () => {
            window.removeEventListener('resize', isShouldScrollHandler);
        }

    }, []);



    /* Event for perspective update */
    useMotionValueEvent(currentScrollValue, 'animationComplete', () => {

        const windowWidth = document.documentElement.clientWidth;
        
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
        
        // should we scroll?
        const shouldScroll = isShouldScroll(windowWidth, cardCount);
        
        if (!shouldScroll) {
            return;
        }

        const gapCount = cardCount - 1;

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
        <section className={styles.carouselSection}>
            <h2 className={styles.carouselTitle}>{title}</h2>
            <p className={styles.carouselGenreDescription}>{genreDescription}</p>
            {/* Buttons */}
            <div className={styles.carouselBtnContainer}>
                    {/* prev slide button controller */}
                    <SlideBtn direction="left" handleClick={handlePrevClick} isDisabled={isPrevBtnDisabled} />
                    {/* next slide button controller */}
                    <SlideBtn direction="right" handleClick={handleNextClick} isDisabled={isNextBtnDisabled} />
                </div>
            {/* main animated list */}
            <div className={styles.carouselContainer}>
                <LazyMotion features={domAnimation}>
                    <m.ul className={styles.carouselList}

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


        </section>
    )
};


export default BookCarousel;
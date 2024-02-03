'use client';

import { memo } from "react";
import { CarouselBooks } from "@/booksStorage/usage/storage";
import Link from "next/link";
import styles from '@/styles/modules/booksPage/singleBookCard.module.scss';
import { m, LazyMotion, domAnimation, useMotionValue, useAnimate } from "framer-motion";
import type { AnimationSequence, MotionValue } from "framer-motion";
import { getCenterOfCard, getPerspectiveOriginCenter } from "@/utils/carouselUtils";


type PlainMouseHandler = (e: MouseEvent) => void;
type ReactMouseHandler = (e: React.MouseEvent<HTMLLIElement>) => void;

interface BookCardProps {
    book: CarouselBooks[0];
    perspectiveOriginValue: MotionValue<string>;
    currentScrollValue: MotionValue<number>;
    cardWidth: number;
    gapWidth: number;
    timerRef: React.MutableRefObject<number | null>;
}

const BookCard = memo(({ book, perspectiveOriginValue, currentScrollValue, cardWidth, gapWidth, timerRef }: BookCardProps) => {
    const { id, title, author, rating } = book;

    const [scope, animate] = useAnimate();

    // motion values
    const rotateXvalue = useMotionValue(0);
    const rotateYvalue = useMotionValue(0);
    const scaleValue = useMotionValue(1);

    // event handlers
    const handleMouseMove: PlainMouseHandler = (e) => {
        const target = (e.target as HTMLElement).closest('li') as HTMLLIElement;
        const coords = target.getBoundingClientRect();

        /* max rotation (in deg) */
        const maxRotationHor = 35;
        const maxRotationVert = 30;

        /* half of width / height to calculate posibility / degree of rotation */
        const rangeOfRotationHor = coords.width / 2;
        const rangeOfRotationVert = coords.height / 2;

        /* location of mouse relatively to card-container */
        const shiftFromLeftEdge = e.clientX - coords.left;
        const shiftFromTopEdge = e.clientY - coords.top;

        /* location of mouse relatively to center of card, maybe + or - */
        const shiftFromCenterHorizontal = shiftFromLeftEdge - rangeOfRotationHor;
        const shiftFromCenterVertical = shiftFromTopEdge - rangeOfRotationVert;

        /* для одновременной анимации */
        const sequencesToAnimate: AnimationSequence = [];

        /* HORIZONTAL */
        const rotationHorDegrees = shiftFromCenterHorizontal / rangeOfRotationHor * maxRotationHor;

        // HORIZONTAL rotation
        sequencesToAnimate.push([rotateYvalue, rotationHorDegrees]);


        /* VERTICAL */
        let rotationVertDegrees: number;
        rotationVertDegrees = shiftFromCenterVertical / rangeOfRotationVert * maxRotationVert; 
    
        // inversion
        rotationVertDegrees *= -1;
        
        // VERTICAL rotation
        sequencesToAnimate.push([rotateXvalue, rotationVertDegrees, { at: '<' }]);

        /* ANIMATING */
        animate(sequencesToAnimate);
    };

    /* timer ref for correct perspective update (without lagging) */
    
    
    const handleMouseEnter: ReactMouseHandler = async (e) => {
        // delete timer on perspective resetting
        if (timerRef.current != null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        const target = (e.target as HTMLElement).closest('li') as HTMLLIElement;
        // updating perspective

        const windowWidth = document.documentElement.clientWidth;
        const coords = target.getBoundingClientRect();
        const newPerspectiveValue = getCenterOfCard(windowWidth, currentScrollValue.get(), cardWidth, gapWidth, coords);


        await animate(scaleValue, 1.2, { duration: 0.4 });
        target.addEventListener('mousemove', handleMouseMove);

        //update
        perspectiveOriginValue.set(newPerspectiveValue);
    };


    const handleMouseLeave: ReactMouseHandler = async (e) => {
        // schedule reset timeout
        timerRef.current = window.setTimeout(() => {
            const windowWidth = document.documentElement.clientWidth;
            const defaultPerspective = getPerspectiveOriginCenter(windowWidth, currentScrollValue.get(), cardWidth, gapWidth);
            perspectiveOriginValue.set(defaultPerspective);
        }, 800);

        const target = (e.target as HTMLElement).closest('li') as HTMLLIElement;

        // back rotate values to 0, then scale to 0
        const animateSequence: AnimationSequence = [
            [rotateXvalue, 0],
            [rotateYvalue, 0, { at: '<' }],
            [scaleValue, 1, { at: +0 }],
        ];

        await animate(animateSequence);
        
        target.removeEventListener('mousemove', handleMouseMove);
    };

    return (
        <LazyMotion features={domAnimation} strict>
            <m.li className={styles.listItem}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX: rotateXvalue, rotateY: rotateYvalue, scale: scaleValue }}
                ref={scope}
            >
                <Link href={`/books/${id}`} className={styles.link}>
                    <p>{title}</p>
                    <p>{author}</p>
                    <p>{rating}</p>
                </Link>
            </m.li>
        </LazyMotion>
    )
});


export default BookCard;
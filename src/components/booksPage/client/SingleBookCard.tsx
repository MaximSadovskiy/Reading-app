'use client';

import { memo } from "react";
import { CarouselBooks } from "@/booksStorage/usage/storage";
import Link from "next/link";
import styles from '@/styles/modules/booksPage/singleBookCard.module.scss';
import { m, LazyMotion, domAnimation, useMotionValue, useAnimate } from "framer-motion";
import type { AnimationSequence } from "framer-motion";
import debounce from "@/utils/debounceDecorator";


type PlainMouseHandler = (e: MouseEvent) => void;
type ReactMouseHandler = (e: React.MouseEvent<HTMLLIElement>) => void;

interface BookCardProps {
    book: CarouselBooks[0];
}

const BookCard = memo(({ book }: BookCardProps) => {
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
        const maxRotationHor = 25;
        const maxRotationVert = 20;

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

    const handleMouseEnter: ReactMouseHandler = (e) => {
        const target = e.target as HTMLLIElement;

        animate(scaleValue, 1.2, { duration: 0.4 });

        setTimeout(() => target.addEventListener('mousemove', handleMouseMove), 400);
    };

    const handleMouseLeave: ReactMouseHandler = (e) => {
        const target = e.target as HTMLLIElement;
        
        // back rotate values to 0, then scale to 0
        const animateSequence: AnimationSequence = [
            [rotateXvalue, 0],
            [rotateYvalue, 0, { at: '<' }],
            [scaleValue, 1, { at: +0 }],
        ];
        animate(animateSequence);

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
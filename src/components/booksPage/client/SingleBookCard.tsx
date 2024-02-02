'use client';

import { memo } from "react";
import { CarouselBooks } from "@/booksStorage/usage/storage";
import Link from "next/link";
import styles from '@/styles/modules/booksPage/singleBookCard.module.scss';
import { m, LazyMotion, domAnimation, useMotionValue, useAnimate } from "framer-motion";
import type { AnimationSequence } from "framer-motion";


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
        const maxRotationX = 30;
        const maxRotationY = 30;
        // center
        // *** LOG
        console.log(`offsetWidth: ${target.offsetWidth} ; height: ${target.offsetHeight}`);

        const rangeOnX = target.offsetWidth / 2;
        const rangeOnY = target.offsetHeight / 2;
        
        const coords = target.getBoundingClientRect();

        console.log(`RANGE x: ${rangeOnX} ; rangeY: ${rangeOnY}`);
        // положение мыши, не учитывая расстояние вне контейнера
        const eventClientX = e.clientX - coords.left;
        const eventClientY = e.clientY - coords.top;
        console.log(`clientX: ${eventClientX}, clientY: ${eventClientY}`);
        // x
        const shiftX = rangeOnX - eventClientX;
        const proportionX = shiftX / rangeOnX;
        // y
        const shiftY = rangeOnY - eventClientY;
        const proportionY = shiftY / rangeOnY;

        console.log(`shiftX: ${shiftX}, shiftY: ${shiftY}`);
        console.log(`proportionX: ${proportionX}, proportionY: ${proportionY}`);

        // rotation
        const yRotation = maxRotationX * +proportionX;
        const xRotation = maxRotationY * +proportionY;

        console.log(`X rotation: ${xRotation} ; Y rotatio: ${yRotation}`);

        /* x rotation - вверх вниз, y rotation - лево право */
        animate(rotateXvalue, -yRotation, { duration: 0.3 });
        animate(rotateYvalue, xRotation, { duration: 0.3 });
    };

    const handleMouseEnter: ReactMouseHandler = async (e) => {
        const target = e.target as HTMLLIElement;

        animate(scaleValue, 1.25, { duration: 0.4 });

        await new Promise(res => setTimeout(res, 0.6)); 

        target.addEventListener('mousemove', handleMouseMove);
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
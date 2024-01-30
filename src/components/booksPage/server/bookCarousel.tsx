'use client';

import { CarouselBooks } from "@/booksStorage/usage/storage";
import BookCard from "../client/SingleBookCard";
import SlideBtn from "../client/SlideBtn";
import styles from '@/styles/modules/booksPage/popularCarousel.module.scss';
import { useRef, useEffect } from 'react';
import createSlideContainer from "@/hooks/useSlideContainer";

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
    const listRef = useRef<HTMLUListElement | null>(null);
    const currentScrollRef = useRef(0);
    const cardCount = renderBooks.length - 1;
    const cardWidth = 220;
    const containerPadding = 20;


    return (
        <section className={styles.popularSection}>
            <h2 className={styles.popularTitle}>{title}</h2>
            <SlideBtn direction="left" />
            <div className={styles.popularContainer}>
                <ul className={styles.popularList}>
                    {renderBooks}
                </ul>
            </div>
            <SlideBtn direction="right" />
        </section>
    )
};


export default BookCarousel;
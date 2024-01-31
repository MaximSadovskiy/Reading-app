import { memo } from "react";
import { CarouselBooks } from "@/booksStorage/usage/storage";
import Link from "next/link";
import styles from '@/styles/modules/booksPage/singleBookCard.module.scss';

interface BookCardProps {
    book: CarouselBooks[0];
}

const BookCard = memo(({ book }: BookCardProps) => {
    const { id, title, author, rating } = book;

    return (
        <li className={styles.listItem}>
            <Link href={`/books/${id}`} className={styles.link}>
                <p>{title}</p>
                <p>{author}</p>
                <p>{rating}</p>
            </Link>
        </li>
    )
});


export default BookCard;
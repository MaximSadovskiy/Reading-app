import BookRead from '@/components/readLayout/BookRead';
import styles from '@/styles/modules/readLayout/readPage.module.scss';

export default function Read() {
    return (
		<main className={styles.main}>
            <div className={styles.readerBlock}>
                <h1 className={styles.title}>
                    Title.
                </h1>
                <img className={styles.img} src="https://litmarket.ru/storage/books/89821_1704286953_65955ae918d16.jpg" data-src="https://litmarket.ru/storage/books/89821_1704286953_65955ae918d16.jpg" width="152" height="238" alt="обложка книги Иоганн Милтон &quot;Идол с глиняного холма&quot;" title="обложка книги Иоганн Милтон &quot;Идол с глиняного холма&quot;" data-was-processed="true"></img>
                <BookRead></BookRead>
            </div>
		</main>
	);
}

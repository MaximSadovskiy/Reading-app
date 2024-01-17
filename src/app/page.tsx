import styles from '@/styles/modules/rootPage/mainPage.module.scss';
import BookRedirect from '../components/readLayout/BookRedirect';

// main component
export default function Home() {

	return (
		<main className={styles.main}>
			<section className={styles.textSection}>
				<h2 className={styles.h2}>
					Добро пожаловать на <strong>Бук<span>Лайф</span></strong>!
				</h2>
				<section>
					<h3 className={styles.h3}><strong>БукЛайф</strong> - это два в одном: </h3>
					<ul className={styles.list}>
						<li>
							Электронная библиотека с широким выбором книг с акцентом на классические произведения
						</li>
						<li>
							Кроссплатформенное приложение для комфортного чтения книг в браузере с удобным интерфейсом
						</li>
					</ul>
				</section>
				<BookRedirect />
			</section>
		</main>
	);
};


// mb delete -->
// helper types
interface TextWithLinkProps {
	text: string;
}

// helper components
const textWithLink = () => {

}
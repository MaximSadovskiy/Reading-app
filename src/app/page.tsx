import styles from '@/styles/modules/rootPage/mainPage.module.scss';
import BookRedirect from '../components/readLayout/BookRedirect';
import Image from 'next/image';
import Link from 'next/link';

// main component
export default function Home() {

	const asideImages1 = ['/bookImg1.jpg', '/bookImg2.jpg', '/bookImg3.jpg'];
	const asideImages2 = ['/bookImg4.jpg', '/bookImg6.jpg', '/bookImg5.jpg'];

	// text for links
	const textBeforeLinkToBooks = 'На нашем сайте представлен большой ассортимент книг от ваших любимых авторов по разным жанрам, найдите в нём книгу подходящую именно Вам: '; 
	const textOfLinkToBooks = 'Каталог Книг';

	const textBeforeLinkToLC = 'Если вы посещаете нас впервые, то мы рекомендуем Вам зарегистрироваться в личном кабинете, это позволит удобно отслеживать прогресс чтения и добавлять новые книги в раздел Желаемое: ';
	const textOfLinkLC = 'Личный Кабинет';

	const textBeforeLinkToRead = 'Если вы уже посещали наш сайт, и выбрали нужную книгу, можете перейти на страницу чтения: ';
	const textOfLinkToRead = 'Страница для Чтения';

	const textBeforeLinkToInfo = 'Если вас интересует информация о нашем сайте: ';
	const textOfLinkToInfo = 'Информация о Сайте';

	return (
		<main className={styles.main}>
			<section className={styles.textSection}>
				<h2 className={styles.h2}>
					Добро пожаловать на <strong>Бук<span>Лайф</span></strong>!
				</h2>
				<section>
					<h3 className={styles.h3}><strong>БукЛайф</strong> - это сразу два в одном: </h3>
					<ul className={styles.list}>
						<li className={styles.listItem}>
							<p>Электронная библиотека с широким ассортиментом книг с акцентом на классические произведения</p>
						</li>
						<li className={styles.listItem}>
							<p>Кроссплатформенное приложение для комфортного чтения книг в браузере с удобным интерфейсом</p>
						</li>
					</ul>
				</section>
				<section>
					<h3 className={styles.h3}>Начать использование:</h3>
					<ul className={styles.list}>
						<li className={styles.listItem}>
							<TextWithLink 
								href='/books'
								parText={textBeforeLinkToBooks}
								linkText={textOfLinkToBooks}
							/>
						</li>
						<li className={styles.listItem}>
							<TextWithLink 
								href='/lc'
								parText={textBeforeLinkToLC}
								linkText={textOfLinkLC}
							/>
						</li>
						<li className={styles.listItem}>
							<TextWithLink 
								href='/read'
								parText={textBeforeLinkToRead}
								linkText={textOfLinkToRead}
							/>
						</li>
						<li className={styles.listItem}>
							<TextWithLink 
								href='/info'
								parText={textBeforeLinkToInfo}
								linkText={textOfLinkToInfo}
							/>
						</li>
					</ul>
				</section>
				<h3 className={styles.h3}>Мы желаем Вам приятного чтения!</h3>
				<BookRedirect />
			</section>
			<AsideWithImages imgSrcs={asideImages1} />
			<AsideWithImages imgSrcs={asideImages2} />
		</main>
	);
};


// helper components

// aside 
interface AsideProps {
	imgSrcs: string[];
}

const AsideWithImages = (props: AsideProps) => {

	const { imgSrcs } = props;

	const renderImgList = imgSrcs.map(src => (
		<div className={styles.innerDiv}>
			<Image src={src} fill={true} alt='' role='presentation' />
		</div>
	));

	return (
		<aside className={styles.aside}>
			{renderImgList}
		</aside>
	)
};

// link
interface LinkProps {
	href: string;
	parText: string;
	linkText: string;
}

const TextWithLink = (props: LinkProps) => {
	return (
		<>
			<p>{props.parText}</p>
			<Link className={styles.link} href={props.href}>{props.linkText}</Link>
		</>
	)
}
import styles from '@/styles/modules/rootPage/mainPage.module.scss';
import Image from 'next/image';
import SlidingLogo from '../components/rootPage/server/SlidingLogo';
import TextSection from '@/components/rootPage/client/TextSection';

// main component
export default function RootPage() {

	const asideImages1 = ['/bookImg1.jpg', '/bookImg2.jpg', '/bookImg3.jpg'];
	const asideImages2 = ['/bookImg4.jpg', '/bookImg6.jpg', '/bookImg5.jpg'];

	// text for links
	const textBeforeLinkToBooks = 'На нашем сайте представлен большой ассортимент книг от ваших любимых авторов по разным жанрам, найдите в нём книгу подходящую именно Вам: '; 
	const textOfLinkToBooks = 'Каталог Книг';

	const textBeforeLinkToLC = 'Если вы посещаете нас впервые, то мы рекомендуем Вам зарегистрироваться, это позволит добавлять понравившиеся книги в вашу персональную Библиотеку: ';
	const textOfLinkLC = 'Регистрация';

	const textBeforeLinkToRead = 'Если вы уже посещали наш сайт, и читали книгу, можете перейти на страницу чтения: ';
	const textOfLinkToRead = 'Читальный зал';

	const textBeforeLinkToInfo = 'Если вы хотите больше узнать о нашем сайте: ';
	const textOfLinkToInfo = 'Информация о Сайте';


	/* Animations  */
	const textData = {
		textBeforeLinkToBooks,
		textOfLinkToBooks,
		textBeforeLinkToLC,
		textOfLinkLC,
		textBeforeLinkToRead,
		textOfLinkToRead,
		textBeforeLinkToInfo,
		textOfLinkToInfo
	};

	return (
		<main className={styles.main}>
			<section className={styles.textSection}>
				{/* big sliding text */}
				<SlidingLogo />
				<TextSection textData={textData} />
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
		<div className={styles.innerDiv} key={src}>
			<Image src={src} fill={true} alt='' role='presentation' sizes='100%' quality={50} />
		</div>
	));

	return (
		<aside className={styles.aside}>
			{renderImgList}
		</aside>
	)
};
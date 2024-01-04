import Image from 'next/image'
import styles from '@/styles/modules/mainPage.module.scss';

export default function Home() {
	return (
		<main className={styles.main}>
			<h1 className={styles.h1}>Hello next js</h1>
		</main>
	)
}
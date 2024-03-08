import styles from "@/styles/modules/rootPage/slidingLogo.module.scss";
import titleStyle from '@/styles/modules/rootPage/textSection.module.scss';
import SlidingText from "../client/slidingText";

const SlidingLogo = () => {

    //<p className={styles.staticText}>БукЛайф это:</p>
    return (
        <>
        <h2 className={titleStyle.h2}>
            Добро пожаловать на <strong>Бук<span>Лайф</span></strong>!
        </h2>
        <div className={styles.slidingBigText}>
            <SlidingText />
            <div className={styles.container2}>
                <ul className={styles.list2}
                >
                    <li>Библиотека</li>
                    <li>Web-Приложение</li>
                </ul>
            </div>
        </div>
        </>
    )
};

export default SlidingLogo;
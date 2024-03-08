import styles from "@/styles/modules/rootPage/slidingLogo.module.scss";
import SlidingText from "../client/slidingText";

const SlidingLogo = () => {

    return (
        <>
            <div className={styles.slidingBigText}>
                <p className={styles.staticText}>БукЛайф это:</p>
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
import styles from "@/styles/modules/about/aboutPage.module.scss";
import { textDataForAboutPage } from "./textData";
import { splitTextToParagraphs } from "@/utils/textFormat/dotsToParagraphs";


export default function AboutPage() {

    const renderingBlocksOfText = textDataForAboutPage.map((textData, index) => (
        <div className={styles.textDiv} key={index}>
            {splitTextToParagraphs(textData)}
        </div>
    )); 

    return (
        <main className={styles.main}>
            <h2>Hello from about page!</h2>
            <section className={styles.textSection}>
                {renderingBlocksOfText}
            </section>
            {/* contacts / donate */}
        </main>
    )
};
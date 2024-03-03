import styles from "@/styles/modules/about/aboutPage.module.scss";
import { dotsToParagraphs } from "@/utils/textFormat/dotsToParagraphs";
import { textDataForAboutPage } from "./textData";

export default function AboutPage() {

    const renderingText = textDataForAboutPage.map(text => dotsToParagraphs(text));
    const renderingBlocksOfText = renderingText.map(textInPars => (
        <div>
            {textInPars}
        </div>
    ));

    return (
        <main className={styles.main}>
            <h2>Hello from about page!</h2>
            {renderingBlocksOfText}
            {/* contacts / donate */}
        </main>
    )
};
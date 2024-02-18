import { NewVerificationForm } from "@/components/formUI/NewVerificationForm";
import styles from "@/styles/modules/formUI/newVerificationPage.module.scss";


const NewVerificationPage = () => {

    return (
        <main className={styles.main}>
            <NewVerificationForm />
        </main>
    )
};

export default NewVerificationPage;
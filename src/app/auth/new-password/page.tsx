import { NewPasswordForm } from "@/components/formUI/NewPasswordForm";
import styles from "@/styles/modules/formUI/formPage.module.scss";
import { LoginTitle } from "@/components/formUI/server/formUI";
import { LoginLink } from "@/components/formUI/server/formUI";

const NewPasswordPage = () => {

    return (
        <main className={styles.main}>
            <LoginTitle text="Введите новый пароль :" />
            <NewPasswordForm />
            <LoginLink href="/auth/login" text="На страницу входа" />
        </main>
    )
};

export default NewPasswordPage;
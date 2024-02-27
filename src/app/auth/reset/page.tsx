import { ResetForm } from "@/components/formUI/ResetForm";
import { LoginLink, LoginTitle } from "@/components/formUI/server/formUI";
import styles from "@/styles/modules/formUI/formPage.module.scss";


const ResetPage = () => {

    return (
        <main className={styles.main}>
            <LoginTitle text="Укажите email, на который можно отправить новый пароль" />
            <ResetForm />
            <LoginLink text="Обратно, на страницу входа" href='/auth/login' />
        </main>
    )
};

export default ResetPage;
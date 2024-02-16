import { RegisterFormWrapper } from "@/components/formUI/RegisterFormWrapper";
import { LoginTitle, LoginLink } from "@/components/formUI/server/formUI";
import styles from "@/styles/modules/formUI/formPage.module.scss";

const RegisterPage = () => {
	return (
		<main className={styles.main}>
			<LoginTitle text="Регистрация Аккаунта" />
			<LoginLink text="У меня уже есть аккаунт..." href="/auth/login" />
			<RegisterFormWrapper />
		</main>
	);
};

export default RegisterPage;

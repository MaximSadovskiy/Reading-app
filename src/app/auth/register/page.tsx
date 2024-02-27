import { RegisterForm } from "@/components/formUI/RegisterForm";
import { LoginTitle, LoginLink } from "@/components/formUI/server/formUI";
import styles from "@/styles/modules/formUI/formPage.module.scss";

const RegisterPage = () => {
	return (
		<main className={styles.main}>
			<LoginTitle text="Регистрация Аккаунта" />
			<LoginLink text="У меня уже есть аккаунт..." href="/auth/login" />
			<RegisterForm />
		</main>
	);
};

export default RegisterPage;

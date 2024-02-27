import { LoginTitle, LoginLink } from "@/components/formUI/server/formUI";
import { LoginForm } from "@/components/formUI/LoginForm";
import styles from "@/styles/modules/formUI/formPage.module.scss";

export const LoginPage = () => {
	return (
		<main className={styles.main}>
			<LoginTitle text="Вход в Аккаунт" />
			<LoginLink text="У вас ещё нет аккаунта?" href="/auth/register" />
			<LoginForm />
		</main>
	);
};

export default LoginPage;
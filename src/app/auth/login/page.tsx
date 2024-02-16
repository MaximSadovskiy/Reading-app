import { LoginTitle, LoginLink } from "@/components/formUI/server/formUI";
import { LoginFormWrapper } from "@/components/formUI/LoginFormWrapper";
import styles from "@/styles/modules/formUI/formPage.module.scss";

export const LoginPage = () => {
	return (
		<main className={styles.main}>
			<LoginTitle text="Вход в Аккаунт" />
			<LoginLink text="У вас ещё нет аккаунта?" href="/auth/register" />
			<LoginFormWrapper />
		</main>
	);
};

export default LoginPage;
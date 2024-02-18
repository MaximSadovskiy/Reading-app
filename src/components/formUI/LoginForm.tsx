"use client";

import { LoginSchema } from "@/schemas/zod/loginSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { loginAction } from "@/server_actions/actions";
import {
	FormFieldWrapper,
	SubmitBtn,
	SubmitStatus,
	ForgotPassword
} from "@/components/formUI/formUI";
// notification
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";


type ResultStatus = 'init' | 'error' | 'success';

interface ClickableImage extends HTMLImageElement {
	dataset: {
		name: "password" | "confirmPassword";
	};
}

export const LoginForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	// result of action
	const [resultState, setResultState] = useState<{
		status: ResultStatus,
		message: string;
	}>({
		status: 'init',
		message: '',
	});

	const router = useRouter();

	const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
		// reset
		setResultState({
			status: 'init',
			message: '',
		});

        loginAction(data)
			.then(response => {
				if (resultState.status !== 'init') return;

				else if (response.success) {
					console.log('setting success');
					setResultState({
						status: 'success',
						message: response.success,
					});
				}
				else {
					setResultState({
						status: 'error',
						message: response.error as string,
					});
				}
			})
			.catch(err => console.log('error on client: ', err));
	};

	// authorize TOAST event
	useEffect(() => {
		if (resultState.status === 'success') {
			toast(resultState.message, {
				theme: 'colored',
				type: 'success',
				onClose: () => {
					router.push(DEFAULT_LOGIN_REDIRECT);
				},
			});
		}
		else if (resultState.status === 'error') {
			toast(resultState.message, {
				theme: 'colored',
				type: 'error',
			});
		}
	}, [resultState]);

	// hiding / showing passwords
	const [isShowPassword, setIsShowPassword] = useState({
		password: false,
		confirmPassword: false,
	});

	const handleHideShowPassword = (e: React.MouseEvent) => {
		const target = e.currentTarget.closest("img") as ClickableImage;

		const name = target.dataset.name;

		setIsShowPassword({
			...isShowPassword,
			[name]: !isShowPassword[name],
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<ToastContainer 
				position='top-right'
				autoClose={2000}
			/>
			{/* <GoogleSubmit onSuccess={setSuccess} onError={setError} />
			<Divider /> */}
			<FormFieldWrapper
				labelText="Имя пользователя"
				isError={errors.username ? true : false}
				errorText={errors.username?.message}
			>
				<input
					{...register("username")}
					placeholder="Иван_001"
					data-invalid={errors.username ? true : false}
				/>
			</FormFieldWrapper>
			<FormFieldWrapper
				labelText="Электронная почта"
				isError={errors.email ? true : false}
				errorText={errors.email?.message}
			>
				<input
					{...register("email")}
					data-invalid={errors.email ? true : false}
					placeholder="ivan.ivanov@email.com"
				/>
			</FormFieldWrapper>
			<FormFieldWrapper
				labelText="Пароль"
				isError={errors.password ? true : false}
				errorText={errors.password?.message}
			>
				<div>
					<input
						{...register("password")}
						type={isShowPassword.password ? "text" : "password"}
						data-invalid={errors.password ? true : false}
						placeholder="*********"
					/>
					<img
						title="показать/скрыть пароль"
						width={30}
						height={30}
						src={
							isShowPassword.password
								? "/eye-show.svg"
								: "/eye-closed.svg"
						}
						data-name="password"
						onClick={handleHideShowPassword}
					/>
				</div>
			</FormFieldWrapper>
			<ForgotPassword />
			<FormFieldWrapper
				labelText="Подтвердите пароль"
				isError={errors.confirmPassword ? true : false}
				errorText={errors.confirmPassword?.message}
			>
				<div>
					<input
						{...register("confirmPassword")}
						type={
							isShowPassword.confirmPassword ? "text" : "password"
						}
						data-invalid={errors.confirmPassword ? true : false}
						placeholder="*********"
					/>
					<img
						title="показать/скрыть пароль"
						width={30}
						height={30}
						src={
							isShowPassword.confirmPassword
								? "/eye-show.svg"
								: "/eye-closed.svg"
						}
						onClick={handleHideShowPassword}
						data-name="confirmPassword"
					/>
				</div>
			</FormFieldWrapper>
			<SubmitBtn isDisabled={isSubmitting} />
			{isSubmitting && (
				<SubmitStatus status="pending" />
			)}
			{resultState.status === 'error' && (
				<SubmitStatus 
                    status="error" 
                    message={resultState.message} 
                />
			)}
			{resultState.status === 'success' && (
                <SubmitStatus
                    status="success"
                    message={resultState.message}
                />
            )}
		</form>
	);
};

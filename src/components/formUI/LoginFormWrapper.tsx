"use client";

import { LoginSchema } from "@/schemas/zod/loginSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState, useRef } from "react";
import { loginAction } from "@/server_actions/actions";
import {
	FormFieldWrapper,
	SubmitBtn,
	SubmitStatus,
} from "@/components/formUI/formUI";
// notification
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { SuccessMessages } from "@/components/formUI/formUI";


interface ClickableImage extends HTMLImageElement {
	dataset: {
		name: "password" | "confirmPassword";
	};
}

export const LoginFormWrapper = () => {
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

	// status for submit
	const [isError, setIsError] = useState({
		status: false,
		message: "",
	});
	const [isSuccess, setIsSuccess] = useState({
		status: false,
		message: "",
	});

	const router = useRouter();

	const timerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
	const LOCAL_STORAGE_TOKEN = 'JUST_AUTHORIZED';

	// Helpers for setting error / success
	const setError = (message: string) => {
		setIsError({
			status: true,
			message,
		});
		toast(message, {
			type: 'error',
			theme: 'colored'
		});
	};

	const setSuccess = (message: string) => {
		setIsSuccess({
			status: true,
			message,
		});
		toast(message, {
			theme: 'colored',
			type: 'success',
			onClose: () => {
				localStorage.removeItem(LOCAL_STORAGE_TOKEN);
				localStorage.removeItem('message');
				router.push(DEFAULT_LOGIN_REDIRECT);
			},
		});
	};

	const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
		// reset
		setIsError({
			status: false,
			message: "",
		});
		setIsSuccess({
			status: false,
			message: '',
		});

		const result = await loginAction(data);

		timerRef.current = setTimeout(() => {
			localStorage.setItem(LOCAL_STORAGE_TOKEN, 'true');
			if (result.success) {
				localStorage.setItem('message', result.success);
			}
		}, 0);
			
		if (result?.error) {
			// terminate timer
			timerRef.current = null;
			// set errors
			setError(result.error);
		}
	};

	// authorize TOAST event
	useEffect(() => {
		const isJustAuthorized = localStorage.getItem(LOCAL_STORAGE_TOKEN);
		const message = localStorage.getItem('message');

		if (isJustAuthorized ) {
			setSuccess(message ?? SuccessMessages['LOGIN']);
		}
	}, []);

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
			{isSubmitting && <SubmitStatus status="pending" />}
			{isError.status && (
				<SubmitStatus status="error" message={isError.message} />
			)}
			{isSuccess.status && (
                <SubmitStatus
                    status="success"
                    message={isSuccess.message}
                />
            )}
		</form>
	);
};

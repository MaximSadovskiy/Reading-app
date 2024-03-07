"use client";

import { NewPasswordSchema } from "@/schemas/zod/loginSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { newPasswordAction } from "@/server_actions/form_actions";
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
import { useSearchParams } from "next/navigation";
import Image from "next/image";

interface ClickableImage extends HTMLImageElement {
	dataset: {
		name: "password" | "confirmPassword";
	};
}

type ResultStatus = 'init' | 'error' | 'success';

export const NewPasswordForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof NewPasswordSchema>>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: '',
            confirmPassword: '',
		},
	});

    // getToken from url
    const searchParams = useSearchParams();
    const newPasswordToken = searchParams.get('token') ?? undefined;

	// result of action
	const [result, setResult] = useState<{
		status: ResultStatus,
		message: string;
	}>({
		status: 'init',
		message: '',
	});

	const router = useRouter();

	const onSubmit = async (data: z.infer<typeof NewPasswordSchema>) => {
		// reset
		setResult({
			status: 'init',
			message: '',
		});

        const result = await newPasswordAction(data, newPasswordToken);

		if (result.success) {
			setResult({
				status: 'success',
				message: result.success,
			});
		}
		else {
			setResult({
				status: 'error',
				message: result.error as string,
			});
		}
	};

	// TOAST event
	useEffect(() => {
		if (result.status === 'success') {
			toast(result.message, {
				theme: 'colored',
				type: 'success',
				onClose: () => {
					router.push(DEFAULT_LOGIN_REDIRECT);
				},
			});
		}
		else if (result.status === 'error') {
			toast(result.message, {
				theme: 'colored',
				type: 'error',
			});
		}
	}, [result, router]);

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
                    <Image
                        title="показать/скрыть пароль"
                        alt="показать/скрыть пароль"
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
                            isShowPassword.confirmPassword
                                ? "text"
                                : "password"
                        }
                        data-invalid={errors.confirmPassword ? true : false}
                        placeholder="*********"
                    />
                    <Image
                        title="показать/скрыть пароль"
                        alt="показать/скрыть пароль"
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
			{result.status === 'error' && (
				<SubmitStatus 
                    status="error" 
                    message={result.message} 
                />
			)}
			{result.status === 'success' && (
                <SubmitStatus
                    status="success"
                    message={result.message}
                />
            )}
		</form>
	);
};

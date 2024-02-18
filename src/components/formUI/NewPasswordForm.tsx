"use client";

import { NewPasswordSchema } from "@/schemas/zod/loginSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { newPasswordAction } from "@/server_actions/actions";
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
	}, [result]);


	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<ToastContainer 
				position='top-right'
				autoClose={2000}
			/>
			<FormFieldWrapper
				labelText=""
				isError={errors.password ? true : false}
				errorText={errors.password?.message}
			>
				<input
					{...register("password")}
					data-invalid={errors.password ? true : false}
					placeholder="******"
				/>
			</FormFieldWrapper>
			<FormFieldWrapper
				labelText=""
				isError={errors.confirmPassword ? true : false}
				errorText={errors.confirmPassword?.message}
			>
				<input
					{...register("confirmPassword")}
					data-invalid={errors.confirmPassword ? true : false}
					placeholder="******"
				/>
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

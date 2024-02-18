"use client";

import { ResetSchema } from "@/schemas/zod/loginSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { forgotPasswordAction } from "@/server_actions/actions";
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


type ResultStatus = 'init' | 'error' | 'success';

export const ResetForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof ResetSchema>>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: '',
		},
	});

	// result of action
	const [result, setResult] = useState<{
		status: ResultStatus,
		message: string;
	}>({
		status: 'init',
		message: '',
	});

	const router = useRouter();

	const onSubmit = async (data: z.infer<typeof ResetSchema>) => {
		// reset
		setResult({
			status: 'init',
			message: '',
		});

        const result = await forgotPasswordAction(data);

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
				isError={errors.email ? true : false}
				errorText={errors.email?.message}
			>
				<input
					{...register("email")}
					data-invalid={errors.email ? true : false}
					placeholder="ivan.ivanov@email.com"
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

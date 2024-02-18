"use client";

import { RegisterSchema, genreLiterals } from "@/schemas/zod/loginSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import {
	FormFieldWrapper,
	Select,
	SubmitBtn,
	SubmitStatus,
} from "@/components/formUI/formUI";
import { useEffect, useState } from "react";
import { registerAction } from "@/server_actions/actions";
import { useRouter } from "next/navigation";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";
import { ErrorMessages, SuccessMessages } from '@/interfaces/formMessages';



interface ClickableImage extends HTMLImageElement {
	dataset: {
		name: "password" | "confirmPassword";
	};
}

type ResultType = {
    status: 'init' | 'error' | 'success';
    message: string | ErrorMessages | SuccessMessages;
}



export const RegisterForm = () => {

    const {
		register,
		handleSubmit,
		control,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
			favouriteGenres: [],
		},
	});

	// result of action
	const [result, setResult] = useState<ResultType>({
		status: 'init',
		message: '',
	});

    const router = useRouter();
    
	// submit handler
	const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
		// reset
		setResult({
            status: 'init',
            message: '',
        });

		const result = await registerAction(data);

		if (result.success) {
			setResult({
				status: 'success',
				message: result.success,
			});
		}
		else if (result.error) {
			setResult({
				status: 'error',
				message: result.error.message,
			});
		}
	};

    useEffect(() => {
        if (result.status === 'success') {
            toast(result.message, {
                theme: 'colored',
                type: 'success',
                onClose: () => {
                    router.push('/auth/login');
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

	const selectOptions = [...genreLiterals];

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
                position="top-right"
                autoClose={2000}
            />
            {/* <GoogleSubmit 
                onError={setError}
                onSuccess={setSuccess}
            /> 
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
                            isShowPassword.confirmPassword
                                ? "text"
                                : "password"
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
            <Controller
                name="favouriteGenres"
                control={control}
                defaultValue={[]}
                render={({
                    field: { onChange },
                    fieldState: { invalid },
                }) => (
                    <Select
                        options={selectOptions}
                        onChange={onChange}
                        isError={errors.favouriteGenres ? true : false}
                        errorText={errors.favouriteGenres?.message}
                        isInvalid={invalid}
                    />
                )}
            />
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
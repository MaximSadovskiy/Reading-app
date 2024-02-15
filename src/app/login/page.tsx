'use client';

import { LoginSchema } from "@/schemas/zod/loginSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { LoginTitle, LoginLink, FormFieldWrapper, SubmitBtn, SubmitStatus } from "@/components/formUI/formUI";
import styles from "@/styles/modules/formUI/formPage.module.scss";
import { useState } from "react";
import { loginAction } from "@/server_actions/actions";


interface ClickableImage extends HTMLImageElement {
    dataset: {
        name: 'password' | 'confirmPassword';
    }
}


export const LoginPage = () => {
    const { 
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        }
    });

    // status for submit
    const [isError, setIsError] = useState({
        status: false,
        message: ''
    });
    const [isSuccess, setIsSuccess] = useState({
        status: false,
        message: ''
    });


    // submit handler
    const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
        // reset
        setIsError({
            status: false,
            message: '',
        });
        setIsSuccess({
            status: false,
            message: '',
        });

        console.log(data);

        const result = await loginAction(data);

        console.log(result);

        if (result.error) {
            setIsError({
                status: true,
                message: result.error,
            });
        }

        else if (result.success) {
            setIsSuccess({
                status: true,
                message: result.success,
            });
        }
    };


    // hiding / showing passwords
    const [isShowPassword, setIsShowPassword] = useState({
        password: false,
        confirmPassword: false,
    });

    
    const handleHideShowPassword = (e: React.MouseEvent) => {
        const target = e.currentTarget.closest('img') as ClickableImage;

        const name = target.dataset.name;

        setIsShowPassword({
            ...isShowPassword,
            [name]: !isShowPassword[name]
        });
    };


    return (
        <main className={styles.main}>
            <LoginTitle text="Вход в Аккаунт" />
            <LoginLink text="У вас ещё нет аккаунта?" href='/register' />
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}> 
                <FormFieldWrapper
                    labelText="Имя пользователя" 
                    isError={errors.username ? true : false}
                    errorText={errors.username?.message}
                >
                    <input 
                        {...register('username')} 
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
                        {...register('email')} 
                        data-invalid={errors.
                        email ? true : false} placeholder="ivan.ivanov@email.com" 
                    />
                </FormFieldWrapper>
                <FormFieldWrapper
                    labelText="Пароль" 
                    isError={errors.password ? true : false}
                    errorText={errors.password?.message}
                >
                    <div>
                        <input 
                            {...register('password')} 
                            type={isShowPassword.password ? 'text' : 'password'} 
                            data-invalid={errors.password ? true : false} placeholder="*********"
                        />
                        <img title="показать/скрыть пароль" width={30} height={30} 
                            src={isShowPassword.password ? '/eye-show.svg' : '/eye-closed.svg'}
                            data-name='password'
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
                            {...register('confirmPassword')} 
                            type={isShowPassword.confirmPassword ? 'text' : 'password'} 
                            data-invalid={errors.confirmPassword ? true : false} placeholder="*********"
                        />
                        <img title="показать/скрыть пароль" width={30} height={30} 
                            src={isShowPassword.confirmPassword ? '/eye-show.svg' : '/eye-closed.svg'}
                            onClick={handleHideShowPassword}
                            data-name='confirmPassword' 
                        />
                    </div>
                </FormFieldWrapper>
                <SubmitBtn isDisabled={isSubmitting} />
                {isSubmitting && <SubmitStatus status="pending" />}
                {isError.status && <SubmitStatus status="error" message={isError.message} />}
                {isSuccess.status && <SubmitStatus status="success" message={isSuccess.message} />}
            </form>
        </main>
    )
};

export default LoginPage;
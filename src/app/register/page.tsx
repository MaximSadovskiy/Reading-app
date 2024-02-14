'use client';

import { RegisterSchema, genreLiterals } from "@/schemas/zod/loginSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from 'zod';
import { FormFieldWrapper, Select, SubmitBtn } from "@/components/formUI/formUI";
import styles from "@/styles/modules/formUI/formPage.module.scss";
import Link from "next/link";


const RegisterPage = () => {
    const { 
        register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            favouriteGenres: [],
        }
    });


    // submit handler
    const onSubmit = (data: z.infer<typeof RegisterSchema>) => console.log(data);

    const selectOptions = [...genreLiterals];

    return (
        <main className={styles.main}>
            <h2 className={styles.title}>Регистрация аккаунта</h2>
            <Link className={styles.linkToLogin} href={'/login'}>У меня уже есть аккаунт...</Link>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}> 
                <FormFieldWrapper
                    labelText="Имя пользователя" 
                    isError={errors.username ? true : false}
                    errorText={errors.username?.message}
                >
                    <input {...register('username')} placeholder="Иван_001" data-invalid={errors.username ? true : false} />
                </FormFieldWrapper>
                <FormFieldWrapper
                    labelText="Электронная почта" 
                    isError={errors.email ? true : false}
                    errorText={errors.email?.message}
                >
                    <input {...register('email')} type="email" data-invalid={errors.email ? true : false} placeholder="ivan.ivanov@email.com" />
                </FormFieldWrapper>
                <FormFieldWrapper
                    labelText="Пароль" 
                    isError={errors.password ? true : false}
                    errorText={errors.password?.message}
                >
                    <input {...register('password')} type="password" data-invalid={errors.password ? true : false} placeholder="*********"/>
                </FormFieldWrapper>
                <FormFieldWrapper
                    labelText="Подтвердите пароль" 
                    isError={errors.confirmPassword ? true : false}
                    errorText={errors.confirmPassword?.message}
                >
                    <input {...register('confirmPassword')} type="password" data-invalid={errors.confirmPassword ? true : false} placeholder="*********"/>
                </FormFieldWrapper>
                <Controller 
                    name="favouriteGenres"
                    control={control}
                    defaultValue={[]}
                    render={ ({ field: { onChange }, fieldState: { invalid } }) => (
                        <Select 
                            options={selectOptions}
                            onChange={onChange}
                            isError={errors.favouriteGenres ? true : false}
                            errorText={errors.favouriteGenres?.message}
                            isInvalid={invalid}
                        />
                    )}
                />
                <SubmitBtn />
            </form>
        </main>
    )
};

export default RegisterPage;
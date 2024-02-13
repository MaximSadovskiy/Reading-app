'use client';

import { RegisterSchema, genreLiterals } from "@/schemas/zod/loginSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from 'zod';
import { FormFieldWrapper, Select } from "@/components/formUI/formUI";


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
            favouriteGenres: [],
        }
    });


    // submit handler
    const onSubmit: SubmitHandler<typeof RegisterSchema> = (data) => console.log(data);

    const selectOptions = [...genreLiterals];

    return (
        <main>
            <form> 
                <FormFieldWrapper
                    labelText="Имя пользователя" 
                    isError={errors.username ? true : false}
                    errorText={errors.username?.message}
                >
                    <input {...register('username')}/>
                </FormFieldWrapper>
                <FormFieldWrapper
                    labelText="Электронная почта" 
                    isError={errors.email ? true : false}
                    errorText={errors.email?.message}
                >
                    <input {...register('email')} type="email"/>
                </FormFieldWrapper>
                <FormFieldWrapper
                    labelText="Пароль" 
                    isError={errors.password ? true : false}
                    errorText={errors.password?.message}
                >
                    <input {...register('password')} type="password"/>
                </FormFieldWrapper>
                <Controller 
                    name="favouriteGenres"
                    control={control}
                    defaultValue={[]}
                    rules={{
                        required: 'Поле обязательно для заполнения'
                    }}
                    render={ ({ field: { onChange, ...rest } }) => (
                        <Select 
                            options={selectOptions}
                            onChange={onChange}
                            {...rest}
                        />
                    )}
                />
            </form>
        </main>
    )
};

export default RegisterPage;
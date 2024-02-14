import { z } from 'zod';

const username = z.string().min(1, { message: 'Поле обязательно для заполнения' });
const email = z.string().min(1, { message: 'Поле обязательно для заполнения' }).email({ message: 'Некорректный email, примеры корректного ввода: ivan@mail.ru , ivan@gmail.com' });
const password = z.string().min(6, { message: 'Пароль должен содержать минимум 6 символов'});

export const genreLiterals = ['Антиутопия', 'Биография', 'Роман', 'Фантастика', 'Фэнтези', 'Детектив', 'Триллер', 'Классика'] as const;

export const RegisterSchema = z.object({
    username,
    email,
    password,
    confirmPassword: password,
    favouriteGenres: z.array(z.enum(genreLiterals)).min(3, { message: 'Выберите по меньшей мере 3 любимых жанра' }),
}).refine((value) => value.password === value.confirmPassword, {
    message: 'Пароль не совпадает с уже введённым',
    path: ['confirmPassword'],
});

export const LoginSchema = z.object({
    username,
    email,
    password,
});
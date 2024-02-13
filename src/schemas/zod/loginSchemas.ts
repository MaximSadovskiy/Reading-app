import { z } from 'zod';

const username = z.string({ required_error: 'Поле обязательно для заполнения' });
const email = z.string({ required_error: 'Поле обязательно для заполнения' }).email({ message: 'Некорректный email, примеры корректного ввода: ivan@mail.ru , ivan@gmail.com' });
const password = z.string({ required_error: 'Поле обязательно для заполнения' }).min(6, { message: 'Пароль должен содержать минимум 6 символов'});

export const genreLiterals = ['Антиутопия', 'Биография', 'Роман', 'Фантастика', 'Фэнтези', 'Детектив', 'Триллер', 'Антиутопия', 'Классика'] as const;

export const RegisterSchema = z.object({
    username,
    email,
    password,
    favouriteGenres: z.array(z.enum(genreLiterals)),
});

type InferredSchema = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
    username,
    email,
    password,
});
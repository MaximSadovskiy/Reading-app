export enum ErrorMessages {
    EMAIL_ALREADY_EXISTS = 'Ошибка: Пользователь с таким адресом электронной почты уже существует',
    // test
    EMAIL_DOESNT_EXISTS = 'Ошибка: Пользователя с таким адресом электронной почты не существует',
    INVALID_DATA = 'Ошибка: данные указаны неверно',
    OTHER = 'Что-то пошло не так...',
    TOKEN_WASNT_FOUND_BY_EMAIL = 'Ошибка: не найден код по указанному email',
    TOKEN_INVALID = 'Ошибка: введён некорректный код',
    TOKEN_EXPIRED = 'Ошибка: срок действия отправленного кода истёк, попробуйте обновить код',
}

export enum SuccessMessages {
    REGISTER_SUCCESS = 'Регистрация завершена успешно, подтверждение отправлено на указанный email',
    LOGIN_SUCCESS = 'Вход в аккаунт выполнен успешно!',
    EMAIL_SENT = 'Письмо с подтверждением отправлено на указанный email',
    TWO_FACTOR = 'Код для подтверждения отправлен на указанный email' 
}

export enum LoginSuccessTypes {
    EMAIL_SENT = 'EMAIL_SENT',
    TWO_FACTOR = 'TWO_FACTOR',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
}
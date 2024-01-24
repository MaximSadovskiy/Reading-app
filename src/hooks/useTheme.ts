import { useState, SetStateAction } from 'react';

//types
export type ThemeType = 'light' | 'dark';
export type SetThemeType = React.Dispatch<SetStateAction<ThemeType>>;

type GetThemeFromLocalStorage = () => ThemeType | null;
type PostThemeToLocalStorage = (currentTheme: ThemeType) => void;

// helpers
const getThemeFromLocalStorage: GetThemeFromLocalStorage = () => {
    return localStorage.getItem('theme') as ThemeType;
};

const postThemeToLocalStorage: PostThemeToLocalStorage = (currentTheme) => {
    localStorage.setItem('theme', currentTheme);
};

// hook
const useTheme = () => {
    const [theme, setTheme] = useState<ThemeType>('dark');
    return [theme, setTheme] as const;
};

export default useTheme;
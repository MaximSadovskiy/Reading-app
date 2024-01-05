import { useState, useEffect, SetStateAction } from 'react';

//types
export type ThemeType = 'light' | 'dark';
export type ToggleTheme = () => void;
export type SetThemeType = React.Dispatch<SetStateAction<ThemeType>>;

type GetThemeFromLocalStorage = () => ThemeType;
type PostThemeToLocalStorage = (currentTheme: ThemeType) => void;
type GetPreferredTheme = () => ThemeType;

// helpers
const themeCondition = '(prefers-color-scheme: dark)';

const getThemeFromLocalStorage: GetThemeFromLocalStorage = () => {
    return localStorage.getItem('theme') as ThemeType;
};

const getPreferredTheme: GetPreferredTheme = () => {
    const prefersDark = window.matchMedia(themeCondition).matches;
    return prefersDark ? 'dark' : 'light';
};

const postThemeToLocalStorage: PostThemeToLocalStorage = (currentTheme) => {
    localStorage.setItem('theme', currentTheme);
};

// hook
const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        return getThemeFromLocalStorage() || getPreferredTheme() as ThemeType;
    });

    // store systemTheme
    const systemTheme = getPreferredTheme();

    useEffect(() => {
        postThemeToLocalStorage(theme);
    }, [theme]);

    return [theme, systemTheme, setTheme] as const;
};

export default useTheme;

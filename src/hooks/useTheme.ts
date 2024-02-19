import { useState, useEffect, SetStateAction } from 'react';

//types
export type ThemeType = 'light' | 'dark';
export type SetThemeType = React.Dispatch<SetStateAction<ThemeType>>;

// helpers
export const getPreferedTheme = (window: Window): ThemeType => {
    const isPreferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isPreferDark ? 'dark' : 'light';
};

const getThemeFromLocalStorage = (window: Window): ThemeType | null => {
    const { localStorage } = window;
    const themeFromStorage = localStorage.getItem('theme') as ThemeType;

    return themeFromStorage ?? null;
};

const postThemeToLocalStorage = (window: Window, theme: ThemeType) => {
    const { localStorage } = window;
    localStorage.setItem('theme', theme);
};

const getInitialTheme = (window: Window) => {
    return getThemeFromLocalStorage(window) ?? getPreferedTheme(window);
};

// hook
const useTheme = (window: Window) => {
    const [theme, setTheme] = useState<ThemeType>(getInitialTheme(window));

    useEffect(() => {
        postThemeToLocalStorage(window, theme);
    }, [theme]);

    return [theme, setTheme] as const;
};

export default useTheme;
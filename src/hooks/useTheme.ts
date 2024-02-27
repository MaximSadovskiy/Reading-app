import { useState, useEffect, SetStateAction } from 'react';

//types
export type ThemeType = 'light' | 'dark';
export type SetThemeType = React.Dispatch<SetStateAction<ThemeType>>;

// helpers
export const getPreferedTheme = (window: Window): ThemeType => {
    const isPreferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return isPreferDark ? 'dark' : 'light';
};

// hook
const useTheme = () => {
    const [theme, setTheme] = useState<ThemeType>('dark');

    return [theme, setTheme] as const;
};

export default useTheme;
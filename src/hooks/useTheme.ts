import { useState, SetStateAction } from 'react';

//types
export type ThemeType = 'light' | 'dark';
export type SetThemeType = React.Dispatch<SetStateAction<ThemeType>>;

// hook
const useTheme = () => {
    const [theme, setTheme] = useState<ThemeType>('dark');
    return [theme, setTheme] as const;
};

export default useTheme;
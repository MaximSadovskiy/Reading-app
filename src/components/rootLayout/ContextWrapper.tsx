'use client';
import React from 'react';
import { GlobalContext } from '@/hooks/useContext';
// hooks
import useTheme from '@/hooks/useTheme';

// types
interface GlobalContextProps {
    children: React.ReactNode;
}


const ContextWrapper = (props: GlobalContextProps) => {
    const [theme, setTheme] = useTheme(window);

    return (
        <GlobalContext.Provider value={{
            theme,
            setTheme,
        }}>
            <body data-dark={theme === 'dark' ? true : false}>
                {props.children}
            </body>
        </GlobalContext.Provider>
    )
};

export default ContextWrapper;
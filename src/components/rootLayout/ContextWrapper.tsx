'use client';
import React, { createContext, useContext } from 'react';
import GlobalContextInterface from '@/interfaces/contextWrapper';
// redux
import StoreProvider from './StoreProvider';
// hooks
import useTheme from '@/hooks/useTheme';


// types
interface GlobalContextProps {
    children: React.ReactNode;
}

const GlobalContext = createContext<GlobalContextInterface | null>(null);

const ContextWrapper = (props: GlobalContextProps) => {
    const [theme, systemTheme, setTheme] = useTheme();

    return (
        <GlobalContext.Provider value={{
            theme,
            systemTheme,
            setTheme,
        }}>
            <StoreProvider>
                <body data-dark={theme === 'dark' ? true : false}>
                    {props.children}
                </body>
            </StoreProvider>
        </GlobalContext.Provider>
    )
};

export default ContextWrapper;

export const useGlobalContext = () => {
    return useContext(GlobalContext) as GlobalContextInterface;
};
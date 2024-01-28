import GlobalContextInterface from '@/interfaces/contextWrapper';
import { createContext, useContext } from 'react';


export const GlobalContext = createContext<GlobalContextInterface | null>(null);

export const useGlobalContext = () => {
    return useContext(GlobalContext) as GlobalContextInterface;
};
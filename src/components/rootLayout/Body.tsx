'use client';
import Header from '@/components/rootLayout/Header';
import { useGlobalContext } from './ContextWrapper';

interface BodyProps {
    children?: React.ReactNode;
}

const Body = (props: BodyProps) => {

    const { theme } = useGlobalContext();

    return (
        <body data-dark={theme === 'dark' ? true : false}>
            <Header />
            {props.children}
        </body>
    )
};


export default Body;
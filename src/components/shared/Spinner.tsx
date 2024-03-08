'use client';

import { ClimbingBoxLoader } from "react-spinners";
import styles from "@/styles/modules/shared/spinner.module.scss";
import { useGlobalContext } from "@/hooks/useContext";


type SpinnerProps = {
    sizing?: 'small' | 'medium' | 'large';
}

export const Spinner = ({ sizing = 'large' }: SpinnerProps) => {
    
    const { theme } = useGlobalContext();

    const sizeProp = sizing === 'large' 
        ? 50
        : sizing === 'medium'
        ? 30
        : 15;

    const colorProp = theme == "dark" ? "hsl(0, 100%, 97%)" : "hsl(0, 38%, 19%)";

    
    return (
        <main className={styles.main}>
            <ClimbingBoxLoader 
                size={sizeProp}
                color={colorProp}
            />
        </main>
    )
};
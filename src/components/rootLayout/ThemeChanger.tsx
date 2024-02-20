'use client';
import { useGlobalContext } from "@/hooks/useContext";
import styles from '@/styles/modules/rootLayout/themeChanger.module.scss';
import React, { useState, useEffect, useRef, forwardRef } from 'react';
// framer
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';
import { listVariants, itemVariants } from "@/animation/variants/popupLists/popupListClipped";
import { getPreferedTheme } from "@/hooks/useTheme";
import type { SetThemeType, ThemeType } from "@/hooks/useTheme";
import { closeIfOutsideClick } from "@/utils/clickOutsideCloseFunction";

// types & helpers
type CustomThemeType = ThemeType | 'system';
type SvgPathType = '/moon.svg' | '/sun.svg' | '/computer.svg';

type GetSvgPath = (currentTheme: CustomThemeType) => SvgPathType;

// helper
const getSvgPath: GetSvgPath = (theme: CustomThemeType) => {
    return theme === 'dark' ? '/moon.svg' : theme === 'light' ? '/sun.svg' : '/computer.svg';
};

// main component
const ThemeChanger = () => {
    const { theme, setTheme } = useGlobalContext();
    const [isOpen, setIsOpen] = useState(false);
    const [svgPath, setSvgPath] = useState<SvgPathType>(() => {
        return getSvgPath(theme);
    });

    // refs for checking if click outside
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // close if 'isOpen' + clickOutside
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            closeIfOutsideClick<HTMLButtonElement | HTMLUListElement>([buttonRef, listRef], e, () => setIsOpen(false));
        }

        document.addEventListener('click', handleOutsideClick, true);

        return () => document.removeEventListener('click', handleOutsideClick, true);
    }, []);

    // get system theme
    const systemThemeRef = useRef<ThemeType | null>(null);

    useEffect(() => {
        // getting system theme
        const systemTheme = getPreferedTheme(window);
        systemThemeRef.current = systemTheme;
    }, []);

    return (
        <div className={styles.outerContainer}>
            <div className={styles.innerContainer}>
                <button 
                    className={styles.button} 
                    data-open={isOpen}
                    onClick={() => setIsOpen(o => !o)}
                    aria-controls="open-list"
                    aria-expanded={isOpen}
                    ref={buttonRef}
                >
                    <span className={styles.buttonText}>тема: </span>
                    <img src={svgPath} alt='' role="presentation" width={35} height={35} />
                </button>
                <LazyMotion features={domAnimation} strict>
                    <AnimatePresence>
                        {isOpen && (
                            <PopupThemeList 
                                setTheme={setTheme} 
                                systemTheme={systemThemeRef.current} 
                                setSvgPath={setSvgPath} 
                                closeList={() => setIsOpen(false)} 
                                svgPath={svgPath} 
                                ref={listRef} 
                            />
                        )}
                    </AnimatePresence>
                </LazyMotion>
            </div>
        </div>
    )
};

export default ThemeChanger;

// types of list
interface ListProps {
    setTheme: SetThemeType;
    systemTheme: ThemeType | null;
    setSvgPath: React.Dispatch<React.SetStateAction<SvgPathType>>
    closeList: () => void;
    svgPath: SvgPathType;
}

type ButtonCustomEvent = React.MouseEvent<HTMLButtonElement & { name: 'light' | 'dark' | 'system' }> ;


const PopupThemeList = forwardRef(({ setTheme, systemTheme, setSvgPath, closeList, svgPath }: ListProps, ref: React.Ref<HTMLUListElement>) => {

    const handleChangeThemeClick = (e: ButtonCustomEvent) => {
        const { name } = e.currentTarget;
        const newTheme = () => {
            if (name === 'system' && systemTheme != null) {
                return systemTheme
            }
            else if (name === 'system') {
                return 'dark'
            }
            else {
                return name
            }
        };
        setTheme(newTheme);
        // extract new path
        const path = getSvgPath(name);
        setSvgPath(path);
        closeList();
    };

    return (
        <>
            <m.ul className={styles.list}
                variants={listVariants}
                exit='exit'
                initial='initial'
                animate='animate'
                
                id='open-list'
                aria-live="polite"
                aria-labelledby="theme-info"
                role="listbox"
                
                ref={ref}
            >
                <m.li role="option" variants={itemVariants} className={styles.li}>
                    <button 
                        onClick={handleChangeThemeClick} data-first 
                        className={styles.buttonOption} name="light"
                    >
                        <img src='/sun.svg' alt="" role="presentation" width={25}  height={25}/>
                        <span className={styles.optionText}>Светлая</span>
                        {svgPath === '/sun.svg' && (
                            <img src='/checked.svg' alt='' role="presentation" width={25} height={25} />
                        )}
                    </button>
                </m.li>
                <m.li role="option" variants={itemVariants} className={styles.li}>
                    <button 
                        onClick={handleChangeThemeClick} 
                        className={styles.buttonOption} name="dark"
                    >
                        <img src='/moon.svg' alt="" role="presentation" width={25}  height={25}/>
                        <span className={styles.optionText}>Тёмная</span>
                        {svgPath === '/moon.svg' && (
                            <img src='/checked.svg' alt='' role="presentation" width={25} height={25} />
                        )}
                    </button>
                </m.li>
                <m.li role="option" variants={itemVariants} className={styles.li}>
                    <button 
                        onClick={handleChangeThemeClick} data-last 
                        className={styles.buttonOption} name="system"
                    >
                        <img src='/computer.svg' alt="" role="presentation" width={25}  height={25}/>
                        <span className={styles.optionText}>Системная</span>
                        {svgPath === '/computer.svg' && (
                            <img src='/checked.svg' alt='' role="presentation" width={25} height={25} />
                        )}
                    </button>
                </m.li>
            </m.ul>
            <p id="theme-info" className="sr-only">Выбор цветовой темы</p>
        </>
    )
});
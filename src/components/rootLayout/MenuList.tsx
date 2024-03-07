'use client';

import styles from "@/styles/modules/rootLayout/menuList.module.scss";
import { forwardRef, useEffect, useRef, useState, useCallback } from "react";
import { Tooltip } from "../shared/Tooltip";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { itemVariants, listVariantsWithoutClipPath } from "@/animation/variants/popupLists/popupListClipped";
import { usePathname } from "next/navigation";
// components
import ThemeChanger from "./ThemeChanger";
import AccountEnter from "./AccountEnter";
import { closeIfOutsideClick } from "@/utils/clickOutsideCloseFunction";


interface MenuProps {
    isTextPresented: boolean;
    orientation: 'mobile' | 'tablet';
}

type TimerType = ReturnType<typeof setTimeout>;

export const MenuList = ({ isTextPresented, orientation }: MenuProps) => {
    
    // open menu state
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    
    // Tooltip
    const tooltipMessage = `${isOpen ? 'закрыть' : 'открыть'} меню`;
    const containerRef = useRef<HTMLDivElement | null>(null);
    // for mouse move --> cancel opening of tooltip 
    const timerRef = useRef<TimerType | null>(null);
    // states
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [menuCoords, setMenuCoords] = useState<DOMRect | null>(null);
    
    const closeCallback = useCallback(() => {
        setIsOpen(false);
        setIsTooltipOpen(false);
    }, []);
    // set coords on mount
    useEffect(() => {
        if (containerRef.current && menuCoords === null) {
            const menuCoords = containerRef.current.getBoundingClientRect();
            setTimeout(() => setMenuCoords(menuCoords), 0);
        }
    }, [menuCoords]);
    
    // tooltip handlers
    const handlePointerEnter = (e: React.PointerEvent) => {
        if (e.pointerType !== 'mouse') {
            return;
        }

        if (menuCoords !== null && isTooltipOpen === false) {
            setIsTooltipOpen(true);
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (e.pointerType !== 'mouse') {
            return;
        }

        if (menuCoords !== null && isTooltipOpen === false) {
            if (timerRef.current != null) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }

            timerRef.current = setTimeout(() => setIsTooltipOpen(true), 800);
        }
    };

    const handlePointerLeave = (e: React.PointerEvent) => {

        if (timerRef.current != null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (e.pointerType !== 'mouse') {
            return;
        }

        if (isTooltipOpen) {
            // if was timer on 'open' --> clear it
            setTimeout(() => {
                setIsTooltipOpen(false)
            }, 350);
        }
    }

    const handlePointerUp = (e: React.PointerEvent) => {
        if (e.pointerType !== 'mouse') {
            return;
        }

        if (isTooltipOpen) {
            // if was timer on 'open' --> clear it
            if (timerRef.current != null) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            setTimeout(() => setIsTooltipOpen(false), 200);
        }
    };

    useEffect(() => {
        if (isOpen && isTooltipOpen) {
            setTimeout(() => setIsTooltipOpen(false), 200);
        }
    }, [isOpen]);

    // NAV --> popup list
    const popupRef = useRef<HTMLUListElement | null>(null);
    const currentURL = usePathname();

    // close if click outside mechanic
    useEffect(() => {

        const handleClickOutside = (e: MouseEvent) => {
            closeIfOutsideClick<HTMLUListElement | HTMLDivElement>([containerRef, popupRef], e, closeCallback);
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
        
    }, [closeCallback]);

    return (
        <>
            {/* TOOltip message */}
            {menuCoords && (
                <AnimatePresence>
                    {isTooltipOpen && (
                        <Tooltip message={tooltipMessage} relativeElCoords={menuCoords} />
                    )}
                </AnimatePresence>
            )}
            <div className={styles.parentContainer}>
                {/* Open btn */}
                <div className={styles.openBtn}
                    role='button'
                    data-active={isOpen}
                    ref={containerRef}
                    onClick={handleClick}
                    onPointerEnter={handlePointerEnter}
                    onPointerLeave={handlePointerLeave}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    >
                    <div></div>
                    <div></div>
                    <div></div>
                    {isTextPresented && (<span className={styles.menuText}>Меню</span>)}
                    {/* inside container cause need Relative pos */}
                </div>  
                <AnimatePresence>
                    {isOpen && (
                        <PopupNavList 
                            currentPath={currentURL}
                            ref={popupRef}
                            closeCallback={closeCallback}
                            orientation={orientation}
                        />
                    )}
                </AnimatePresence>
            </div>
        </>
    )
};



// Popup list (nav + theme + account menus)
interface PopupListProps {
    currentPath: string;
    closeCallback: () => void;
    orientation: 'mobile' | 'tablet';
}

const PopupNavList = forwardRef(function PopupNavList(

        { currentPath, closeCallback, orientation }: PopupListProps, 
        listRef: React.ForwardedRef<HTMLUListElement>,

    ) {

    return (
        <LazyMotion features={domAnimation}>
            <m.ul className={styles.popupList}
                    variants={listVariantsWithoutClipPath}
                    exit='exit'
                    initial='initial'
                    animate='animate'
                    id="open-list"
                    aria-live="polite"
                    aria-labelledby="account-info"
                    role="listbox"
                    ref={listRef}
            >
                <m.li
                    variants={itemVariants}
                >
                    <Link 
                        href='/' 
                        className={`${styles.btnOption} ${currentPath === '/' && styles.active}`}
                        onClick={closeCallback}
                    >Главная
                    </Link>
                </m.li>
                <m.li
                    variants={itemVariants}
                >
                    <Link 
                        href='/books' 
                        className={`${styles.btnOption} ${currentPath === '/books' && styles.active}`}
                        onClick={closeCallback}
                    >Книги
                    </Link>
                </m.li>
                <m.li
                    variants={itemVariants}
                >
                    <Link 
                        href='/about' 
                        className={`${styles.btnOption} ${currentPath === '/about' && styles.active}`}
                        onClick={closeCallback}
                    >О нас
                    </Link>
                </m.li>
                {orientation === 'mobile' && (
                    <>
                        <ThemeChanger styleMode='mobile' />
                        <AccountEnter styleMode='mobile' />
                    </>
                )}
            </m.ul>
        </LazyMotion>
    )
});
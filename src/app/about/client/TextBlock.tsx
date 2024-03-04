'use client';
import styles from "@/styles/modules/about/textBlock.module.scss";
import { useEffect, useRef } from "react";
import debounce from "@/utils/debounceDecorator";
import { getWindowTopOffset } from "@/utils/coordinates/findOffset";

type TextBlockProps = { 
    children: React.ReactNode;
    index: number;
}

type DivWithAnimateAttr = HTMLDivElement & { dataset: { animate: boolean } };

export const TextBlock = ({ children, index }: TextBlockProps) => {
    
    const divRef = useRef<DivWithAnimateAttr>(null);
    const divWindowOffset = useRef(0);
    // min scroll value div need to appear
    const appearScrollOffset = useRef(0);
     
    
    // first 2 divs appear instantly on the page
    useEffect(() => {
        if (index === 0 || index === 1 && divRef.current !== null) {
            (divRef.current as NonNullable<DivWithAnimateAttr>).dataset.animate = true;
        }
    }, []);

    // other divs
    useEffect(() => {
        if (typeof window !== 'undefined' && divRef.current !== null) {
            // div offset (1 time calculation)
            if (divWindowOffset.current === 0 || appearScrollOffset.current === 0) {
                const divCoords = divRef.current.getBoundingClientRect();
                const windowHeight = document.documentElement.clientHeight;
                const addedOffset = 400; // элемент появится раньше на 200 px

                divWindowOffset.current = getWindowTopOffset(
                    divCoords.height, windowHeight, addedOffset,  
                );;

                // find needed scroll offset to appear
                appearScrollOffset.current = divCoords.top - divWindowOffset.current;
            }

            // check if div in viewport
            // if it is --> give it data-animate=true
            const handleAppearance = debounce(() => {
                if (window.scrollY >= appearScrollOffset.current) {
                    (divRef.current as NonNullable<DivWithAnimateAttr>)
                        .dataset.animate = true;
                }
            }, 100);


            document.addEventListener('scroll', handleAppearance);

            return () => {
                document.removeEventListener('scroll', handleAppearance);
            }
        }
    }, []);

    return (
        <div className={styles.textBlock}
            ref={divRef}
        >{children}</div>
    )
}
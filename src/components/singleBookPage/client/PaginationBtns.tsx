'use client';

import { useRouter, usePathname, useSearchParams } from "next/navigation"; 
import styles from "@/styles/modules/singleBookPage/paginationBtns.module.scss";
import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Tooltip } from "@/components/shared/Tooltip";


interface PaginationBtnsProps {
    numberOfAllComments: number;
}

interface BtnWithPageNumber extends HTMLButtonElement {
    dataset: {
        page: string;
    }
}

type TimerRefType = ReturnType<typeof setTimeout>;

// how many comments take for 1 page
const takeCommentsLimit = 4;
const tooltipMessage = 'Вы на этой странице';

export const PaginationBtns = ({ numberOfAllComments }: PaginationBtnsProps) => {

    // changing search params to fetch new comments on server component
    const searchParams = useSearchParams();
    const pathName = usePathname();
    const { replace } = useRouter();
    
    const currentPageNumber = searchParams.get('page') ?? '1';

    // change page number on click
    const handleChangePageNumber = (e: React.MouseEvent) => {
        const target = e.currentTarget.closest('button[data-page]') as BtnWithPageNumber;
        
        const newPageNumber = target.dataset.page;
        
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('page', newPageNumber);
        
        const newURL = `${pathName}?${newSearchParams.toString()}`;
        // change url to new page number
        replace(newURL);
    };

    
    // TOOLTIP state
    const [isTooltipRendered, setIsTooltipRendered] = useState(false);
    const [btnCoords, setBtnCoords] = useState<DOMRect | null>(null);

    const timerRef = useRef<TimerRefType | null>(null);

    // EVENT HANDLERS
    const handleMouseEnter = async (e: React.MouseEvent) => {
        const target = e.currentTarget.closest('button[data-active=true]');
        
        if (!target) return;
        
        // set timer
        const result = await new Promise((res) => {
            timerRef.current = setTimeout(() => {
                // callback after 200ms
                // this time timer can be null
                // if user moves mouse away from element
                if (timerRef.current !== null) {
                    res(true);
                }
                // negative case (user moves mouse away)
                else {
                    res(false);
                }
                
            }, 200);
        });
    

        if (!result) return;
        // user on element yet --> set states
        setBtnCoords(target.getBoundingClientRect());
        setIsTooltipRendered(true);
    };

    // no tooltip if mouse leaves
    const handleMouseLeave = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        // reset state
        setIsTooltipRendered(false);
        setBtnCoords(null);
    };  
    
    
    let numberOfPages = Math.floor(numberOfAllComments / takeCommentsLimit);
    // if have a remainder -> +1 page
    if (numberOfAllComments > numberOfPages) {
        numberOfPages++;
    }

    // btn for each page
    let renderingBtns = new Array(numberOfPages).fill(0).map((_, ind) => {
        const pageNumber = String(ind + 1);
        // check current page
        const isActive = pageNumber === currentPageNumber;

        const key = `pagBtnNumber_${ind + 1}`;

        return (
            <li key={key}>
                <button
                    className={styles.singleBtn} 
                    onClick={handleChangePageNumber}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    data-page={pageNumber}
                    data-active={isActive}
                >
                    {pageNumber}
                </button>
            </li>
        )
    });
    

    return (
        <div className={styles.btnsWrapper}>
            <AnimatePresence>
                {(isTooltipRendered && btnCoords) && (
                    <Tooltip
                        message={tooltipMessage}
                        relativeElCoords={btnCoords} 
                    />
                )}
            </AnimatePresence>
            <ul>
                {renderingBtns}
            </ul>
        </div>
    )
}
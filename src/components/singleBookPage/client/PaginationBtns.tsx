'use client';

import { useRouter, usePathname, useSearchParams } from "next/navigation"; 
import styles from "@/styles/modules/singleBookPage/paginationBtns.module.scss";

interface PaginationBtnsProps {
    numberOfAllComments: number;
}

interface BtnWithPageNumber extends HTMLButtonElement {
    dataset: {
        page: string;
    }
}

// how many comments take for 1 page
const takeCommentsLimit = 4;

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
            <ul>
                {renderingBtns}
            </ul>
        </div>
    )
}
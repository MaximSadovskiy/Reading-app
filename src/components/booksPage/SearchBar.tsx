'use client';

import { useState, useRef } from "react";
import useModal from "@/hooks/useModal";
import debounce from "@/utils/debounceDecorator";
import BookInterface from "@/interfaces/bookInterface";
import styles from '@/styles/modules/booksPage/searchBar.module.scss';
import { openBackdrop, closeBackdrop } from '@/lib/features/backdrop/backdropSlice';
import { useAppDispatch } from "@/lib/hooks";
import Backdrop from "@/lib/features/backdrop/Backdrop";
import Image from "next/image";


// other
const apiUrl = '/api/books';

// main component
interface SearchBarProps {

}

const SearchBar = (props: SearchBarProps) => {

    // modal
    // mb change to DOM id if not going to work...
    const modalRef = useRef<HTMLDivElement | null>(null);
    const backdropRef = useRef<HTMLDivElement | null>(null); 
    const { isOpen, openModal, closeModal } = useModal(modalRef, backdropRef);
    //backdrop
    const dispatch = useAppDispatch();

    const buttonHandleClick = () => {
        if (isOpen == false) {
            openModal();
            dispatch(openBackdrop());
        } 
        else if (isOpen == true) {
            closeModal();
            dispatch(closeBackdrop());
        }
    };

    // search state
    const [query, setQuery] = useState('');
    const [searchMode, setSearchMode] = useState<'name' | 'author'>('name');
    const [results, setResults] = useState<BookInterface[]>([]);

    // search request
    const search = debounce(async (query: string) => {
        const response = await fetch(`${apiUrl}?mode=${searchMode}&query=${query}`);

        if (response.ok == false) {
            console.log('Something went wrong');
        } 
        else {
            const data = await response.json();
            setResults(data);
        }
        
    }, 1000);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        search(query);
    };

    // output of results list
    let resultsListToRender: Omit<BookInterface, 'files'>[];

    return (
        <div className={styles.wrapper}>
            {!isOpen && (
                <button className={styles.openBtn} onClick={buttonHandleClick}>
                    <SearchSvg width={40} height={40} />
                    <p>Найдётся всё...</p>
                </button>
            )}
            {isOpen &&(
                <>
                    <div>
                        <label htmlFor='search'></label>
                        <input
                            id='search' 
                            value={query}
                            onChange={handleSearch}
                            autoComplete="off"
                            placeholder="например: война и мир"
                        />
                    </div>
                    <Backdrop ref={backdropRef} />
                </>
            )}
        </div>
    )
};

export default SearchBar;

// helper components
// Toggler

const SearchSvg = ({width = 80, height = 80}: {color?: string, width?: number, height?: number}) => {
    return (
        <svg width={`${width}px`} height={`${height}px`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
            <g id="SVGRepo_iconCarrier">
                <path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
        </svg>
    )
}
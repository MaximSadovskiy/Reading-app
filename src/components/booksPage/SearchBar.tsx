'use client';

import { useState, useRef, useEffect, SetStateAction } from "react";
import useModal from "@/hooks/useModal";
import debounce from "@/utils/debounceDecorator";
import BookInterface from "@/interfaces/bookInterface";
import styles from '@/styles/modules/booksPage/searchBar.module.scss';
import Backdrop from "@/lib/features/backdrop/Backdrop";
// анимации
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { listVariants, itemVariants } from "@/styles/variants/themeToggler/themeTogglerVariants";
// modal
import closeIfOutsideClick from "@/utils/clickOutsideCloseFunction";


// other
const apiUrl = '/api/books';

// main component
interface SearchBarProps {

}

const SearchBar = (props: SearchBarProps) => {

    // Modal & Backdrop refs
    const modalRef = useRef<HTMLDivElement>(null);
    // Modal and Backdrop Open state 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        if (!isModalOpen) setIsModalOpen(true);
    }
    const closeModal = () => {
        if (isModalOpen) setIsModalOpen(false);
    }

    // custom hook (effect)
    useModal(modalRef, closeModal, isModalOpen);

    // open / close Search Modal
    const buttonHandleClick = () => {
        if (isModalOpen == false) {
            openModal();
        } 
        else if (isModalOpen == true) {
            closeModal();
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
            <p className={styles.searchPar}>Поиск книг:</p>
            <button className={styles.openBtn} onClick={() => buttonHandleClick()}>
                <SearchSvg width={40} height={40} />
                <p>Найдётся всё...</p>
            </button>
            {isModalOpen &&(
                <>
                    <div className={styles.searchBarModalWrapper} ref={modalRef}>
                        <Toggler searchMode={searchMode} setSearchMode={setSearchMode} />
                        <input
                            className={styles.searchInput}
                            id='search' 
                            value={query}
                            onChange={handleSearch}
                            autoComplete="off"
                            placeholder={`например: ${searchMode === 'name' ? 'Война и мир' : 'Лев Толстой'}`}
                        />
                    </div>
                    <Backdrop />
                </>
            )}
        </div>
    )
};

export default SearchBar;

// helper components

// Toggler

interface TogglerProps {
    searchMode: 'name' | 'author';
    setSearchMode: React.Dispatch<SetStateAction<'name' | 'author'>>;
}

const Toggler = ({ searchMode, setSearchMode }: TogglerProps) => {

    // открывает / закрывает меню с изменением поиска (name / author);
    const [isToggleOpen, setIsToggleOpen] = useState(false);
    const listRef = useRef<HTMLUListElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);


    // TESTING - DELETE LATER
    useEffect(() => {
        if (isToggleOpen) console.log('isToggleOpen = true');
        else console.log('isToggleOpen = false');
    }, [isToggleOpen]);

    // helpers functions
    const openBtnClick = () => {
        if (isToggleOpen) {
            setIsToggleOpen(false);
        } else {
            setIsToggleOpen(true);
        }
    };

    const setModeToName = () => {
        if (searchMode !== 'name') {
            setSearchMode('name');
        }
        setIsToggleOpen(false);
    };

    const setModeToAuthor = () => {
        if (searchMode !== 'author') {
            setSearchMode('author');
        }
        setIsToggleOpen(false);
    };

    // close if outside click when open
    useEffect(() => {
        if (isToggleOpen == true) {
            const handleOutsideClick = (e: MouseEvent) => {
                closeIfOutsideClick<HTMLUListElement | HTMLButtonElement>([listRef, btnRef], e, () => setIsToggleOpen(false));   
            };
            
            console.log('Toggler: ADD event listener');
            document.addEventListener('click', handleOutsideClick);
    
            return () => {
                console.log('Toggler: CLEAN event listener');
                document.removeEventListener('click', handleOutsideClick);
            }
        }
    }, [isToggleOpen, listRef, btnRef]);

    // text
    const btnText = searchMode === 'name' ? 'Названию' : 'Автору';

    return (
        <div className={styles.toggleWrapper}>
            <label className={styles.toggleLabel} htmlFor="search">Искать по: </label>
            <button
                ref={btnRef}
                className={styles.toggleOpenBtn}

                aria-expanded={isToggleOpen} 
                aria-controls="search-info" 
                onClick={openBtnClick}
            >
                <p>{btnText}</p>
                <ArrowSvg isOpen={isToggleOpen} width={28} height={28} />
            </button>
            <LazyMotion features={domAnimation} strict>
                <AnimatePresence>
                    {isToggleOpen && (
                        <m.ul
                            key='search-info'
                            className={styles.toggleList}
        
                            id='search-info'
                            aria-live="polite"
                            aria-labelledby="search-info"
                            role="listbox"
        
                            variants={listVariants}
                            initial='initial'
                            animate='animate'
                            exit='exit'
        
                            ref={listRef}
                        >
                            <m.li className={styles.toggleListItem} role="option" variants={itemVariants}>
                                <button onClick={() => setModeToName()}>названию</button>
                            </m.li>
                            <m.li className={styles.toggleListItem} role="option" variants={itemVariants}>
                                <button onClick={(e) => setModeToAuthor()}>автору</button>
                            </m.li>
                        </m.ul>
                    )}
                </AnimatePresence>
            </LazyMotion>
            <p id="search-info" className="sr-only">Выберите режим поиска</p>
        </div>
    )
}

// Svg
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
};


const ArrowSvg = ({width = 30, height = 30, isOpen}: {width: number, height: number, isOpen: boolean}) => {

    return (
        <svg data-open={isOpen} width={`${width}px`} height={`${height}px`} viewBox="0 0 24.00 24.00" xmlns="http://www.w3.org/2000/svg" stroke="#ffc9a3" strokeWidth="0.00024000000000000003" transform='rotate(90deg)'>

            <g id="SVGRepo_bgCarrier" strokeWidth="0"/>

            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>

            <g id="SVGRepo_iconCarrier"> <path d="M18.2929 15.2893C18.6834 14.8988 18.6834 14.2656 18.2929 13.8751L13.4007 8.98766C12.6195 8.20726 11.3537 8.20757 10.5729 8.98835L5.68257 13.8787C5.29205 14.2692 5.29205 14.9024 5.68257 15.2929C6.0731 15.6835 6.70626 15.6835 7.09679 15.2929L11.2824 11.1073C11.673 10.7168 12.3061 10.7168 12.6966 11.1073L16.8787 15.2893C17.2692 15.6798 17.9024 15.6798 18.2929 15.2893Z"/> </g>

        </svg>
    )
}
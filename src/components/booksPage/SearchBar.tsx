'use client';

import { useState, useRef, useEffect, SetStateAction } from "react";
import useModal from "@/hooks/useModal";
import debounce from "@/utils/debounceDecorator";
import { BookInterface } from "@/interfaces/bookInterface";
import { BooksForSearch } from "@/app/api/books/search/route";
import styles from '@/styles/modules/booksPage/searchBar.module.scss';
import Backdrop from "@/lib/features/backdrop/Backdrop";
import Image from "next/image";
// анимации
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { listVariants, itemVariants } from "@/styles/variants/themeToggler/themeTogglerVariants";
import getModalBlurVariants from "@/animation/variants/modalBlurVariants";
// modal
import closeIfOutsideClick from "@/utils/clickOutsideCloseFunction";


const baseApiUrl = 'http://localhost:3000/api/books/search';

// WRAPPER

const SearchBar = () => {

    // Modal and Backdrop Open state 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        if (!isModalOpen) setIsModalOpen(true);
    }
    const closeModal = () => {
        if (isModalOpen) setIsModalOpen(false);
    }

    // open / close Search Modal
    const buttonHandleClick = () => {
        if (isModalOpen == false) {
            openModal();
        } 
        else if (isModalOpen == true) {
            closeModal();
        }
    };

    

    return (
        <div className={styles.wrapper}>
            <p className={styles.searchPar}>Поиск книг:</p>
            <button className={styles.openBtn} onClick={() => buttonHandleClick()}>
                <SearchSvg width={40} height={40} />
                <p>Найдётся всё...</p>
            </button>
            <LazyMotion features={domAnimation} strict>
                <AnimatePresence>
                    {isModalOpen && (
                        <>
                            <SearchModal isModalOpen={isModalOpen} closeModal={closeModal} />
                            <Backdrop />
                        </>
                    )}
                </AnimatePresence>
            </LazyMotion>
        </div>
    )
};

export default SearchBar;

// helper components

// MODAL

interface SearchModalProps {
    isModalOpen: boolean;
    closeModal: () => void;
}

const SearchModal = ({ isModalOpen, closeModal }: SearchModalProps) => {

    const modalRef = useRef<HTMLDivElement>(null);

    // custom hook (effect)
    useModal(modalRef, closeModal, isModalOpen);

    // search state
    const [query, setQuery] = useState('');
    const [searchMode, setSearchMode] = useState<'name' | 'author'>('name');
    const [results, setResults] = useState<BookInterface[]>([]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    // search request
    useEffect(() => {
        if (query.length > 1) {
            try {
                // declare request
                const doSearch = async () => {
                    const encodedQuery = encodeURIComponent(query);
                    const searchParams = `?query=${encodedQuery}&mode=${searchMode};`;
                    const apiURL = new URL(`${baseApiUrl}${searchParams}`);

                    console.log('apiURL: ', apiURL);

                    const response = await fetch(apiURL, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    const data = await response.json();

                    console.log('data: ', data);
                }

                // call request
            
                doSearch();
            } catch (err) {
                console.log('error on client: ', err);
            }
        }
    }, [query, searchMode]);

    return (
        <>
            <m.div className={styles.searchBarModalWrapper} ref={modalRef}

                variants={getModalBlurVariants('17px')}
                initial='initial'
                animate='animate'
                exit='exit'

                key='searchModal'
                >
                <Toggler searchMode={searchMode} setSearchMode={setSearchMode} />
                <input
                    className={styles.searchInput}
                    id='search' 
                    value={query}
                    onChange={handleSearch}
                    autoComplete="off"
                    placeholder={`например: ${searchMode === 'name' ? 'Война и мир' : 'Лев Толстой'}`}
                />
            </m.div>
            <SearchResults inputQuery={query} searchResults={results} />
        </>
    )
}

// SEARCH RESULTS
interface SearchResultsProps {
    inputQuery: string;
    searchResults: BooksForSearch;
}

const SearchResults = (props: SearchResultsProps) => {

    const { inputQuery, searchResults } = props;

    // if input empty
    if (inputQuery.length === 0) {
        return (
            <div className={styles.resultsWrapper}>
                <p className={styles.noResultsText}>К сожалению, ничего не нашлось...</p>
                <Image src="/emotions/sad.svg" width={100} height={100} alt='sad emoji'/>
            </div>
        )
    }

    const renderedList = searchResults.map(searchResult => (
        <li className={styles.resultsItem}>
            <p className={styles.resultsAuthor}>{searchResult.author}</p>
            <p className={styles.resultsName}>{searchResult.name}</p>
        </li>
    ));

    return (
        <div className={styles.resultsWrapper}>
            <ul className={styles.resultsList}>
                {renderedList}
            </ul>
        </div>
    );
};


// TOGGLER inside modal

interface TogglerProps {
    searchMode: 'name' | 'author';
    setSearchMode: React.Dispatch<SetStateAction<'name' | 'author'>>;
}

const Toggler = ({ searchMode, setSearchMode }: TogglerProps) => {

    // открывает / закрывает меню с изменением поиска (name / author);
    const [isToggleOpen, setIsToggleOpen] = useState(false);
    const listRef = useRef<HTMLUListElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);

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
            
            document.addEventListener('click', handleOutsideClick);
    
            return () => {
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
                                <button onClick={() => setModeToName()}>
                                    <p>названию</p>
                                </button>
                            </m.li>
                            <m.li className={styles.toggleListItem} role="option" variants={itemVariants}>
                                <button onClick={(e) => setModeToAuthor()}>
                                    <p>автору</p>
                                </button>
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
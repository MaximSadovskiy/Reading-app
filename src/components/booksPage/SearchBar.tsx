'use client';

import { useState, useRef, useEffect, SetStateAction } from "react";
import useModal from "@/hooks/useModal";
import debounce from "@/utils/debounceDecorator";
import styles from '@/styles/modules/booksPage/searchBar.module.scss';
import Backdrop from "@/components/shared/Backdrop";
import Image from "next/image";
import Link from "next/link";
import { ArrowSvg, SearchSvg } from "@/components/shared/Svg";
// анимации
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import { listVariants, itemVariants } from "@/animation/variants/popupLists/popupListClipped";
import getModalBlurVariants from "@/animation/variants/modalBlurVariants";
import upDownVariants from "@/animation/variants/upDownVariants";
// modal
import { closeIfOutsideClick } from "@/utils/clickOutsideCloseFunction";


type BooksForSearch = {
    id: number;
    title: string;
    authorDisplayName: string;
    rating: number;
}[];

type SearchResult = { error: string } | { success: BooksForSearch } | undefined;

// WRAPPER
type SearchProps = {
    baseApiUrl: string;
}

const SearchBar = ({ baseApiUrl }: SearchProps) => {

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
                            <SearchModal 
                                isModalOpen={isModalOpen} 
                                closeModal={closeModal}
                                baseApiUrl={baseApiUrl} 
                            />
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
    baseApiUrl: string
}

const SearchModal = ({ isModalOpen, closeModal, baseApiUrl }: SearchModalProps) => {

    const modalRef = useRef<HTMLDivElement>(null);

    // custom hook (effect)
    useModal(modalRef, closeModal, isModalOpen);

    // search state
    const [query, setQuery] = useState('');
    const [searchMode, setSearchMode] = useState<'title' | 'author'>('title');
    const [results, setResults] = useState<BooksForSearch>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isNoResults, setIsNoResults] = useState(false);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 0) setIsLoading(true);
        if (isNoResults === true) setIsNoResults(false); 
        setQuery(e.target.value);
    };

    // search request
    const controllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (query.length > 0) {
                // aborting mechanism
                if (controllerRef.current !== null) {
                    controllerRef.current.abort();
                }

                controllerRef.current = new AbortController();
                const signal = controllerRef.current.signal;

                // declare request (try catch - for aborting)
                const doSearch = debounce(async () => {
                    try {
                        /* const baseUrl = 'http//localhost:3000/api/books/search/allbooks'; */
                        const encodedQuery = encodeURIComponent(query);
                        const searchParams = `?mode=${searchMode}&query=${encodedQuery}`;
                        const apiURL = new URL(`${baseApiUrl}${searchParams}`);

                        const response = await fetch(apiURL, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            // abort signal
                            signal,
                            next: {
                                // 1 hour
                                revalidate: 3600,
                            },
                        });

                        // RESULT
                        const searchResultObject: SearchResult = await response.json();

                        console.log('search result: ', searchResultObject);

                        if (!searchResultObject || 'error' in searchResultObject || searchResultObject.success.length === 0) {
                            setIsLoading(false);
                            setIsNoResults(true);
                            return;
                        }

                        setResults(searchResultObject.success);
                        setIsLoading(false);
                    } catch (err) {

                    }
                }, 1000);

                // call request
                doSearch();
        }
    }, [query, searchMode, baseApiUrl]);

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
                    placeholder={`например: ${searchMode === 'title' ? 'Война и мир' : 'Лев Толстой'}`}
                />
                <button onClick={() => closeModal()}
                className={styles.exitSearchBtn}><p>Выйти</p></button>
            </m.div>
            <SearchResults inputQuery={query} searchResults={results} isLoading={isLoading} isNoResults={isNoResults} />
        </>
    )
}

// SEARCH RESULTS
interface SearchResultsProps {
    inputQuery: string;
    searchResults: BooksForSearch;
    isLoading: boolean;
    isNoResults: boolean;
}

const SearchResults = (props: SearchResultsProps) => {

    const { inputQuery, searchResults, isLoading, isNoResults } = props;

    // if query is empty
    if (inputQuery.length === 0) {
        return (
            <m.div className={styles.resultsWrapper}
                variants={upDownVariants}
                initial='initial'
                animate='animate'
                exit='exit'
                key='search-results'
                
                data-results={false}
            >
                <p  className={styles.noResultsText}>Ожидаем Ваш запрос...</p>
                <Image src="/emotions/happy.svg" width={100} height={100} alt='happy emoji'/>
            </m.div>
        )
    }

    // loading state
    else if (isLoading === true) {
        return (
            <m.div className={styles.resultsWrapper}
                variants={upDownVariants}
                initial='initial'
                animate='animate'
                exit='exit'
                key='search-results'
                
                data-results={false}
            >
                <p className={styles.noResultsText}>Загружаем книги...</p>
                <Image src="/emotions/loading.svg" width={100} height={100} alt='happy emoji'/>
            </m.div>
        )
    }

    // if result empty
    else if (isNoResults === true) {
        return (
            <m.div className={styles.resultsWrapper}
                variants={upDownVariants}
                initial='initial'
                animate='animate'
                exit='exit'
                key='search-results'
                
                data-results={false}
            >
                <p className={styles.noResultsText}>К сожалению, ничего не нашлось...</p>
                <Image src="/emotions/sad.svg" width={100} height={100} alt='sad emoji'/>
            </m.div>
        )
    }

    // results ready to watch
    const renderedList = searchResults.map(searchResult => (
        <li key={searchResult.id} className={styles.resultsItem}>
            <Link href={`/books/${searchResult.id}`} className={styles.resultsWrapperUnderP}>
                <p className={styles.resultsAuthor}>{searchResult.authorDisplayName}</p>
                <p className={styles.resultsDash}>&#8212;</p>
                <p className={styles.resultsTitle}>&quot;{searchResult.title}&quot;</p>
                <p className={styles.resultsRating}>{searchResult.rating}</p>
            </Link>
        </li>
    ));

    return (
        <m.div className={styles.resultsWrapper}
            variants={upDownVariants}
            initial='initial'
            animate='animate'
            exit='exit'
            key='search-results'

            data-results={true}
        >
            <ul className={styles.resultsList}>
                {renderedList}
            </ul>
        </m.div>
    );
};

// TOGGLER inside modal

interface TogglerProps {
    searchMode: 'title' | 'author';
    setSearchMode: React.Dispatch<SetStateAction<'title' | 'author'>>;
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
        if (searchMode !== 'title') {
            setSearchMode('title');
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
    const btnText = searchMode === 'title' ? 'Названию' : 'Автору';

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
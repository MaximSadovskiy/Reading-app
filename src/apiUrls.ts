const DOMAIN_URL = process.env.DOMAIN_URL;
// api urls used in components
const SEARCH_ALL_BOOKS_URL = `${DOMAIN_URL}/api/books/search/allbooks`;
const SEARCH_MY_LIBRARY_BOOKS_URL = `${DOMAIN_URL}/api/books/search/my_library`; 

export { SEARCH_ALL_BOOKS_URL, SEARCH_MY_LIBRARY_BOOKS_URL };
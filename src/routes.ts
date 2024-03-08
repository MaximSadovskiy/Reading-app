/**
 * An array of routes that are accessible to the public
 * They do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ['/', '/books', '/books/:id', '/about', '/auth/new-verification', '/read/:id'];


/**
 * Routes that are used for authentication
 * These routes will redirect to my_library page ('/my_library')
 * @type {string[]}
 */
export const authRoutes = ['/auth/login', '/auth/register', '/auth/reset', '/auth/new-password'];

/**
 * The prefix for API authentication routes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';
export const apiBooksPrefix = '/api/books';

/**
 * The default redirect after logging in
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = '/';
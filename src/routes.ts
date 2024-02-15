/**
 * An array of routes that are accessible to the public
 * They do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ['/', '/books', '/about'];


/**
 * Routes that are used for authentication
 * These routes will redirect to Home page ('/')
 * @type {string[]}
 */
export const authRoutes = ['/login', '/register'];

/**
 * The prefix for API authentication routes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * The default redirect after logging in
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = '/';
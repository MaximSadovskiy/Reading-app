/**
 * An array of routes that are accessible to the public
 * They do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ['/', '/books', '/about'];


/**
 * Routes that are used for authentication
 * These routes will redirect to my_library page ('/my_library')
 * @type {string[]}
 */
export const authRoutes = ['/auth/login', '/auth/register'];

/**
 * The prefix for API authentication routes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * The default redirect after logging in
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = '/my_library';
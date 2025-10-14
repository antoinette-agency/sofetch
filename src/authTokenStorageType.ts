/**
 * Describes the methods by which soFetch stores an auth token:
 * - memory - stores the token in local memory. The token will persist between calls to soFetch() but will be lost when a user navigates away or refreshes the page. Can be used with Node
 * - sessionStorage - stores the token in the browser's sessionStorage. The token will persist as long as the tab stays open and remains on the domain. Survives page refreshes but the token will be lost if the tab is closed. Will throw an error if used with Node.
 * - localStorage - stores the token in the browsers' localStorage. The token will persist indefinitely and will be accessible to any script running within the current domain. Will throw an error if used with Node.
 * - cookie - stores the token in a cookie for 7 days. Can be used with Node where the pseudo-cookie will persist for the lifetime of the instance
 * - <code>(() => (string | Promise<string>))</code> - uses as a token the string value returned by a sync or async function
 * - null - does not persist the token
 */
export type AuthTokenStorageType =
    "memory"
    | "sessionStorage"
    | "localStorage"
    | "cookie"
    | (() => (string | Promise<string>))
    | null
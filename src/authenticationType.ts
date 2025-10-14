/**
 * Describes the methods by which soFetch sends authentication credentials to a server
 * - basic - Uses [basic authentication]("https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication#basic") with a (typically non-expiring) username and password
 * - bearer - Uses [bearer authentication]("https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication#bearer") with an authentication token. This is typically obtained as the result of a login process, e.g. OAuth
 * - header - Uses a token, but passes it to the server via a custom header which is named with the `authHeaderKey` property of the config
 * - header - Uses a token, but passes it to the server via a query string entry which is named with the `queryStringKey` property of the config
 * - cookies - Sends the cookie which is keyed under the `authenticationKey` property (default value is 'SOFETCH_AUTHENTICATION')
 * - null - Does not send authentication credentials to the server
 */
export type AuthenticationType = "basic" | "bearer" | "header" | "queryString" | "cookies" | null
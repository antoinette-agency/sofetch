/**
 * Describes the methods by which soFetch sends authentication credentials to a server
 * - basic - Uses [basic authentication]("https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication#basic") with a (typically non-expiring) username and password
 * - bearer - Uses [bearer authentication]("https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication#bearer") with an authentication token. This is typically obtained as the result of a login process, e.g. OAuth
 * - header - Uses a token, but passes it to the server via a custom header which is named with the `authHeaderKey` property of the config
 * - header - Uses a token, but passes it to the server via a query string entry which is named with the `queryStringKey` property of the config
 * - cookies - Sends the cookie which is keyed under the `authenticationKey` property (default value is 'SOFETCH_AUTHENTICATION')
 * - null - Does not send authentication credentials to the server
 */
export declare type AuthenticationType = "basic" | "bearer" | "header" | "queryString" | "cookies" | null;

/**
 * Describes the methods by which soFetch stores an auth token:
 * - memory - stores the token in local memory. The token will persist between calls to soFetch() but will be lost when a user navigates away or refreshes the page. Can be used with Node
 * - sessionStorage - stores the token in the browser's sessionStorage. The token will persist as long as the tab stays open and remains on the domain. Survives page refreshes but the token will be lost if the tab is closed. Will throw an error if used with Node.
 * - localStorage - stores the token in the browsers' localStorage. The token will persist indefinitely and will be accessible to any script running within the current domain. Will throw an error if used with Node.
 * - cookie - stores the token in a cookie for 7 days. Can be used with Node where the pseudo-cookie will persist for the lifetime of the instance
 * - <code>(() => (string | Promise<string>))</code> - uses as a token the string value returned by a sync or async function
 * - null - does not persist the token
 */
export declare type AuthTokenStorageType = "memory" | "sessionStorage" | "localStorage" | "cookie" | (() => (string | Promise<string>)) | null;

/**
 * A integer-keyed dictionary of arrays of response handlers.
 */
export declare type ErrorHandlerDict = {
    [key: number]: Array<(r: Response) => void>;
};

export declare type FileWithFieldName = {
    file: File;
    fieldName: string;
};

/**
 * Makes an HTTP request to the specified URL.
 * @template TResponse The primitive or object type you're expecting from the server
 * @param {string} url An absolute or relative URL
 * @param {UploadPayload} [body] If absent soFetch will make a GET request. If present soFetch will make a POST request. To make PUT, PATCH, DELETE requests see soFetch.put, soFetch.patch, soFetch.delete
 * @returns An awaitable SoFetchPromise which resolves to type TResponse
 * @example
 *
 *    const products = await soFetch<Product[]>("/api/products")
 *
 * @see For more examples see https://sofetch.antoinette.agency
 */
declare const soFetch: SoFetchLike;
export default soFetch;

/**
 * Configures all requests for a specific soFetch instance
 */
export declare class SoFetchConfig {
    private errorHandlers;
    protected beforeSendHandlers: ((request: SoFetchRequest) => Promise<SoFetchRequest | void> | SoFetchRequest | void)[];
    protected beforeFetchSendHandlers: ((request: RequestInit) => Promise<RequestInit | void> | RequestInit | void)[];
    protected onRequestCompleteHandlers: ((response: Response, requestData: {
        duration: number;
        method: string;
    }) => Promise<void> | void)[];
    /**
     * Specifies how (or if) soFetch should persist and authentication
     */
    authTokenStorage: AuthTokenStorageType;
    private inMemoryAuthToken;
    /**
     * Specifies how soFetch should send authentication credentials to the server
     */
    authenticationType: AuthenticationType;
    protected getAuthToken: () => Promise<string>;
    /**
     * Use this method to set an auth token after it's been received from a server, typically as
     * the response to a login request
     * @param authToken
     */
    setAuthToken: (authToken: string) => void;
    /**
     * The base URL for all HTTP requests in the instance. If absent this is assumed to be the current base url.
     * If running in Node relative requests without a baseUrl will throw an error.
     */
    baseUrl: string;
    /**
     * The key which is used if an authentication token is persisted via cookies, localStorage or sessionStorage
     */
    authenticationKey: string;
    /**
     * The key which is used if an authentication token is sent to the server via a custom header
     */
    authHeaderKey: string;
    /**
     * The key which is used if an authentication token is sent to the server via the query string
     */
    authQueryStringKey: string;
    /**
     * Adds a handler which will be executed on receipt from the server of the specified status code.
     * Multiple handlers will be executed in the order in which they are added. If a request has it's
     * own handler(s) for a given status code the corresponding handlers in the config will not be executed.
     * @param status An HTTP status code
     * @param handler A function which accepts a Fetch Response as an argument
     * @example
     *
     *    soFetchConfig.catchHttp(404, (res:Response) => {
     *         alert("This object can't be found")
     *     })
     *
     * @see For more examples see https://sofetch.antoinette.agency
     */
    catchHTTP(status: number, handler: (res: Response) => void): void;
    /**
     * Adds a handler which will be executed before every request. beforeSend handlers on the config
     * will be executed before request-specific handlers
     * @param handler
     * @example
     *
     *    soFetch.config.beforeSend((req:SoFetchRequest) => {
     *       console.info(`Sending ${req.method} request to URL ${req.url}`
     *    })
     *
     * @see For more examples see https://sofetch.antoinette.agency
     */
    beforeSend(handler: (request: SoFetchRequest) => Promise<SoFetchRequest | void> | SoFetchRequest | void): void;
    /**
     * Adds a handler which will be executed before every request. beforeSend handlers on the config
     * will be executed before request-specific handlers
     * @param handler
     * @example
     *
     *    soFetch.config.beforeSend((req:SoFetchRequest) => {
     *       console.info(`Sending ${req.method} request to URL ${req.url}`
     *    })
     *
     * @see For more examples see https://sofetch.antoinette.agency
     */
    beforeFetchSend(handler: (request: RequestInit) => Promise<RequestInit | void> | RequestInit | void): void;
    /**
     * Adds a handler which will be executed after every request. Handlers will fire regardless of whether
     * the response status code indicated an error
     * @param handler
     * @example
     *
     *    soFetch.config.onRequestComplete((r: Response) => {
     *       console.info(`Response received from ${r.url} with status ${r.status}`
     *    })
     *
     * @see For more examples see https://sofetch.antoinette.agency
     */
    onRequestComplete(handler: (r: Response, metaData: {
        duration: number;
        method: string;
    }) => void | Promise<void>): void;
    private setAuthTokenStorage;
    /**
     * Tells soFetch to use [bearer authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication#bearer) to send an authentication token to the server
     * @param authToken - optional. Use this if you have already obtained a token from a login process. Typically this would be left undefined for bearer authentication as the token is usually obtained from a login process.
     * @param authenticationKey - optional. Specify an authentication key if you don't want to use the default: 'SOFETCH_AUTHENTICATION'
     * @param authTokenStorage - optional, defaults to 'localStorage' on the browser and 'memory' in Node
     */
    useBearerAuthentication(props?: {
        authenticationKey?: string;
        authTokenStorage?: AuthTokenStorageType;
        authToken?: string;
    }): void;
    /**
     * Tells soFetch to authenticate using cookies.
     * @param authToken - optional. Use this if you have already obtained a token. Typically this would be left undefined for bearer authentication as the token is usually obtained from a login process.
     * @param authenticationKey - optional. Specify an authentication key if you don't want to use the default: 'SOFETCH_AUTHENTICATION'
     */
    useCookieAuthentication(props?: {
        authenticationKey?: string;
        authToken?: string;
    } | undefined): void;
    /**
     * Tells soFetch to send an authentication token to the server
     * @param headerKey - required. The key of the header with which to send the authentication token
     * @param authToken - optional. Use this if you have already obtained a token.
     * @param authenticationKey - optional. Specify an authentication key if you don't want to use the default: 'SOFETCH_AUTHENTICATION'
     * @param authTokenStorage - optional, defaults to 'localStorage' on the browser and 'memory' in Node
     */
    useHeaderAuthentication({ headerKey, authToken, authenticationKey, authTokenStorage }: {
        headerKey: string;
        authenticationKey?: string;
        authToken?: string;
        authTokenStorage?: AuthTokenStorageType;
    }): void;
    /**
     * Tells soFetch to send append an authentication token to the request query string
     * @param queryStringKey - required. The key of the query string item with which to send the authentication token
     * @param authToken - optional. Use this if you have already obtained a token.
     * @param authenticationKey - optional. Specify an authentication key if you don't want to use the default: 'SOFETCH_AUTHENTICATION'
     * @param authTokenStorage - optional. Defaults to 'localStorage' on the browser and 'memory' in Node
     */
    useQueryStringAuthentication({ queryStringKey, authToken, authenticationKey, authTokenStorage }: {
        queryStringKey: string;
        authenticationKey?: string;
        authToken?: string;
        authTokenStorage?: AuthTokenStorageType;
    }): void;
    /**
     * Tells soFetch to use [basic authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication#basic) when communicating with the server
     * @param username - optional but required is password is used. Use this if you've already obtained a username and password.
     * @param password - optional but required is username is used. Use this if you've already obtained a username and password.
     * @param authenticationKey - optional. Specify an authentication key if you don't want to use the default: 'SOFETCH_AUTHENTICATION'
     * @param authTokenStorage - optional, defaults to 'localStorage' on the browser and 'memory' in Node
     */
    useBasicAuthentication({ username, password, authenticationKey, authTokenStorage }: {
        username?: string;
        password?: string;
        authenticationKey?: string;
        authTokenStorage?: AuthTokenStorageType;
    }): void;
    private setBasicAuthCredentials;
}

export declare interface SoFetchLike<TResponse = unknown> {
    verbose: boolean;
    config: SoFetchConfig;
    get<T>(url: string, body?: UploadPayload): SoFetchPromise<T>;
    post<T>(url: string, body?: UploadPayload): SoFetchPromise<T>;
    put<T>(url: string, body?: UploadPayload): SoFetchPromise<T>;
    patch<T>(url: string, body?: UploadPayload): SoFetchPromise<T>;
    delete<T>(url: string, body?: UploadPayload): SoFetchPromise<T>;
    <T>(url: string, body?: UploadPayload): SoFetchPromise<T>;
    instance(config?: SoFetchConfig): SoFetchLike<TResponse>;
}

/**
 * An awaitable promise-like class that additionally allows event and error handlers to be attached to the HTTP request
 * @example
 *
 *    const unicorn = await soFetch("https://unicorns.com/1234")
 *      .beforeSend(req:SoFetchRequest) => {
 *          console.info(`Finding my unicorn at ${req.url}`)
 *       })
 *      .catchHttp(404, (res:Response) => {
 *         console.error("This unicorn can't be found")
 *       })
 */
export declare class SoFetchPromise<T> {
    private readonly inner;
    errorHandlers: ErrorHandlerDict;
    beforeSendHandlers: ((request: SoFetchRequest) => Promise<SoFetchRequest | void> | SoFetchRequest | void)[];
    beforeFetchSendHandlers: ((init: RequestInit) => Promise<RequestInit | void> | RequestInit | void)[];
    onRequestCompleteHandlers: ((response: Response, requestData: {
        duration: number;
        method: string;
    }) => void | Promise<void>)[];
    timeout: number;
    then: Promise<T>["then"];
    catch: Promise<T>["catch"];
    finally: Promise<T>["finally"];
    constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void);
    /**
     * Adds a handler which will be executed after this HTTP request is completed. Handlers will fire regardless of whether
     * the response status code indicated an error
     * @param handler
     * @example
     *
     *    await soFetch("https://example.com/users",{name:"Sarah", id:1234}).onRequestComplete((r: Response) => {
     *       console.info(`Response received from ${r.url} with status ${r.status}`
     *    })
     *
     * @see For more examples see https://sofetch.antoinette.agency
     */
    onRequestComplete(handler: (response: Response) => void | Promise<void>): SoFetchPromise<T>;
    /**
     * Adds a handler which will be executed before this HTTP request is sent. BeforeSend handlers added here will
     * will be executed after those added on the config.
     * @param handler
     * @example
     *
     *    await soFetch("https://example.com/users",{name:"Sarah", id:1234}).beforeSend((req:SoFetchRequest) => {
     *       console.info(`Sending ${req.method} request to URL ${req.url}`
     *    })
     *
     * @see For more examples see https://sofetch.antoinette.agency
     */
    beforeSend(handler: (request: SoFetchRequest) => Promise<SoFetchRequest | void> | SoFetchRequest | void): SoFetchPromise<T>;
    /**
     * Adds a handler which allows developers to modify the low-level fetch RequestInit object before the HTTP
     * request is made. These handlers execute after beforeSend handlers. This is useful for one-off
     * occasions when you need to access some aspect of the low-level Fetch API. If you're using this a lot
     * it might make more sense for you to use the Fetch API directly.
     * @param handler
     * @example
     *
     *    //An example of how you might send both files and data in a single request.
     *    const postFilesAndDataResponse = await soFetch.put<PostFilesAndDataResponse>("https://example.com/files-and-data").beforeFetchSend((init:RequestInit) => {
     *       const formData = new FormData()
     *       formData.append("company", "Antoinette");
     *       formData.append("file1", myFile)
     *       const headers = {...init.headers} as Record<string,string>
     *       if (headers["content-type"]) {
     *           delete headers["content-type"]
     *       }
     *       init.body = formData
     *       init.headers = headers
     *       return init
     *    })
     *
     * @see For more examples see https://sofetch.antoinette.agency
     */
    beforeFetchSend(handler: (request: RequestInit) => Promise<RequestInit | void> | RequestInit | void): SoFetchPromise<T>;
    /**
     * Adds a handler which will be executed on receipt from the server of the specified status code.
     * Multiple handlers will be executed in the order in which they are added. If you add an error handler
     * for a specific status code here any corresponding handlers in the config will not be executed.
     * @param status An HTTP status code
     * @param handler A function which accepts a Fetch Response as an argument
     * @example
     *
     *    const unicorn = await soFetch("https://unicorns.com/1234")
     *      .catchHttp(404, (res:Response) => {
     *         console.error("This unicorn can't be found")
     *     })
     *
     * @see For more examples see https://sofetch.antoinette.agency
     */
    catchHTTP(status: number, handler: (response: Response) => void): SoFetchPromise<T>;
    setTimeout(ms: number): Promise<this>;
}

export declare interface SoFetchRequest {
    url: string;
    method: string;
    body: object | undefined;
    headers: Record<string, string>;
}

/**
 * The payload supplied to a soFetch request. This can be undefined, or a plain serialisable object
 * (for JSON requests) of a file, or array of files, or a FileWithFieldName or array of type FileWithFieldName
 * (if your endpoint requires the files to have specified field names)
 */
export declare type UploadPayload = object | File | File[] | FileWithFieldName | FileWithFieldName[] | undefined;

export { }

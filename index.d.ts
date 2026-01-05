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
 * Specifies the browser when selecting a pre-defined user agent
 */
export declare type Browser = "Chrome" | "Firefox" | "Safari" | "Edge" | null;

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
 * Status codes issued by a server in response to a client's request.
 * All HTTP response status codes are separated into five classes or categories. The first digit of the status code defines the class of response, while the last two digits do not have any classifying or categorization role. There are five classes defined by the standard:
 *
 * - 1xx informational response – the request was received, continuing process
 * - 2xx successful – the request was successfully received, understood, and accepted
 * - 3xx redirection – further action needs to be taken in order to complete the request
 * - 4xx client error – the request contains bad syntax or cannot be fulfilled
 * - 5xx server error – the server failed to fulfil an apparently valid request
 *
 * @see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 */
export declare enum HttpStatus {
    /**
     * Interim response indicates that everything so far is OK and that the client should continue with the request or ignore it if it is already finished.
     * @see https://http.cat/status/100
     */
    Continue100 = 100,
    /**
     * Sent in response to an Upgrade request header by the client, and indicates the protocol the server is switching too.
     * @see https://http.cat/status/101
     */
    SwitchingProtocols101 = 101,
    /**
     * Indicates that the server has received and is processing the request, but no response is available yet.
     * @see https://http.cat/status/102
     */
    Processing102 = 102,
    /**
     * The request has succeeded. The meaning of a success varies depending on the HTTP method:
     * GET: The resource has been fetched and is transmitted in the message body.
     * HEAD: The entity headers are in the message body.
     * POST: The resource describing the result of the action is transmitted in the message body.
     * TRACE: The message body contains the request message as received by the server
     * @see https://http.cat/status/200
     */
    OK200 = 200,
    /**
     * Request has succeeded and a new resource has been created as a result of it. This is typically the response sent after a PUT request.
     * @see https://http.cat/status/201
     */
    Created201 = 201,
    /**
     * Request has been received but not yet acted upon. It is non-committal, meaning that there is no way in HTTP to later send an asynchronous response indicating the outcome of processing the request. It is intended for cases where another process or server handles the request, or for batch processing.
     * @see https://http.cat/status/202
     */
    Accepted202 = 202,
    /**
     * There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones.
     * @see https://http.cat/status/204
     */
    NoContent204 = 204,
    /**
     * Response code is sent after accomplishing request to tell user agent reset document view which sent this request.
     * @see https://http.cat/status/205
     */
    ResetContent205 = 205,
    /**
     * Response code is used because of range header sent by the client to separate download into multiple streams.
     * @see https://http.cat/status/206
     */
    PartialContent206 = 206,
    /**
     * Request has more than one possible responses. User-agent or user should choose one of them. There is no standardized way to choose one of the responses.
     * @see https://http.cat/status/300
     */
    MultipleChoices300 = 300,
    /**
     * Means that URI of requested resource has been changed. Probably, new URI would be given in the response.
     * @see https://http.cat/status/301
     */
    MovedPermanently301 = 301,
    /**
     * Means that URI of requested resource has been changed temporarily. New changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.
     * @see https://en.wikipedia.org/wiki/HTTP_302
     */
    Found302 = 302,
    /**
     * Server sent this response to directing client to get requested resource to another URI with an GET request.
     * @see https://http.cat/status/303
     */
    SeeOther303 = 303,
    /**
     * Used for caching purposes. It is telling to client that response has not been modified. So, client can continue to use same cached version of response.
     * @see https://http.cat/status/304
     */
    NotModified304 = 304,
    /**
     * @deprecated
     * Was defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy. It has been deprecated due to security concerns regarding in-band configuration of a proxy.
     * @see https://http.cat/status/305
     */
    UseProxy305 = 305,
    /**
     * Server sent this response to directing client to get requested resource to another URI with same method that used prior request. This has the same semantic than the 302 Found HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     * @see https://http.cat/status/307
     */
    TemporaryRedirect307 = 307,
    /**
     * Means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
     * @see https://http.cat/status/308
     */
    PermanentRedirect308 = 308,
    /**
     * Server could not understand the request due to invalid syntax.
     * @see https://http.cat/status/400
     */
    BadRequest400 = 400,
    /**
     * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
     * @see https://http.cat/status/401
     */
    Unauthorized401 = 401,
    /**
     * Reserved for future use. Initial aim for creating this code was using it for digital payment systems however this is not used currently.
     * @see https://http.cat/status/402
     */
    PaymentRequired402 = 402,
    /**
     * Client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response. Unlike 401, the client's identity is known to the server.
     * @see https://http.cat/status/403
     */
    Forbidden403 = 403,
    /**
     * Server can not find requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client.
     * @see https://http.cat/status/404
     */
    NotFound404 = 404,
    /**
     * Request method is known by the server but has been disabled and cannot be used. For example, an API may forbid DELETE-ing a resource. The two mandatory methods, GET and HEAD, must never be disabled and should not return this error code.
     * @see https://http.cat/status/405
     */
    MethodNotAllowed405 = 405,
    /**
     * Response is sent when the web server, after performing server-driven content negotiation, doesn't find any content following the criteria given by the user agent.
     * @see https://http.cat/status/406
     */
    NotAcceptable406 = 406,
    /**
     * Similar to 401 but authentication is needed to be done by a proxy.
     * @see https://http.cat/status/407
     */
    ProxyAuthenticationRequired407 = 407,
    /**
     * Response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection.
     * @see https://http.cat/status/408
     */
    RequestTimeout408 = 408,
    /**
     * Sent when a request conflicts with the current state of the server.
     * @see https://http.cat/status/409
     */
    Conflict409 = 409,
    /**
     * Response would be sent when the requested content has been permenantly deleted from server, with no forwarding address.
     * @see https://http.cat/status/410
     */
    Gone410 = 410,
    /**
     * Server rejected the request because the Content-Length header field is not defined and the server requires it.
     * @see https://http.cat/status/411
     */
    LengthRequired411 = 411,
    /**
     * Client has indicated preconditions in its headers which the server does not meet.
     * @see https://http.cat/status/412
     */
    PreconditionFailed412 = 412,
    /**
     * URI requested by the client is longer than the server is willing to interpret.
     * @see https://http.cat/status/413
     */
    PayloadTooLarge413 = 413,
    /**
     * Media format of the requested data is not supported by the server, so the server is rejecting the request.
     * @see https://http.cat/status/414
     */
    URITooLong414 = 414,
    /**
     * Media format of the requested data is not supported by the server.
     * @see https://http.cat/status/415
     */
    UnsupportedMediaType415 = 415,
    /**
     * Range specified by the Range header field in the request can't be fulfilled
     * @see https://http.cat/status/416
     */
    RangeNotSatisfiable416 = 416,
    /**
     * Response code means the expectation indicated by the Expect request header field can't be met by the server.
     * @see https://http.cat/status/417
     */
    ExpectationFailed417 = 417,
    /**
     * Any attempt to brew coffee with a teapot should result in the error code "418 I'm a teapot". The resulting entity body MAY be short and stout.
     * @see https://http.cat/status/418
     */
    ImATeapot418 = 418,
    /**
     * Defined in the specification of HTTP/2 to indicate that a server is not able to produce a response for the combination of scheme and authority that are included in the request URI.
     * @see https://http.cat/status/421
     */
    MisdirectedRequest421 = 421,
    /**
     * Request was well-formed but was unable to be followed due to semantic errors.
     * @see https://http.cat/status/422
     */
    UnprocessableEntity422 = 422,
    /**
     * The resource that is being accessed is locked.
     * @see https://http.cat/status/423
     */
    Locked423 = 423,
    /**
     * Request failed due to failure of a previous request.
     * @see https://http.cat/status/424
     */
    FailedDependency424 = 424,
    /**
     *
     * @see https://http.cat/status/425
     */
    TooEarly425 = 425,
    /**
     * The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.
     * @see https://http.cat/status/426
     */
    UpgradeRequired426 = 426,
    /**
     * The origin server requires the request to be conditional. Intended to prevent the 'lost update' problem, where a client GETs a resource's state, modifies it, and PUTs it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.
     * @see https://http.cat/status/428
     */
    PreconditionRequired428 = 428,
    /**
     * User has sent too many requests in a given amount of time
     * @see https://http.cat/status/429
     */
    TooManyRequests429 = 429,
    /**
     * Server is unwilling to process the request because its header fields are too large.
     * @see https://http.cat/status/431
     */
    RequestHeaderFieldsTooLarge431 = 431,
    /**
     * User requested a resource that cannot legally be provided, such as a web page censored by a government.
     * @see https://en.wikipedia.org/wiki/HTTP_451
     */
    UnavailableForLegalReasons451 = 451,
    /**
     * Server encountered an unexpected condition that prevented it from fulfilling the request.
     * @see https://http.cat/status/500
     */
    InternalServerError500 = 500,
    /**
     * Request method is not supported by the server and cannot be handled
     * @see https://http.cat/status/501
     */
    NotImplemented501 = 501,
    /**
     * Server, while working as a gateway to get a response needed to handle the request, got an invalid response.
     * @see https://http.cat/status/502
     */
    BadGateway502 = 502,
    /**
     * Server is not ready to handle the request.
     * @see https://http.cat/status/503
     */
    ServiceUnavailable503 = 503,
    /**
     * Response is given when the server is acting as a gateway and cannot get a response in time.
     * @see https://http.cat/status/504
     */
    GatewayTimeout504 = 504,
    /**
     * HTTP version used in the request is not supported by the server.
     * @see https://http.cat/status/505
     */
    HTTPVersionNotSupported505 = 505,
    /**
     * Server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.
     * @see https://http.cat/status/506
     */
    VariantAlsoNegotiates506 = 506,
    /**
     * Indicates that a method could not be performed because the server cannot store the representation needed to successfully complete the request.
     * @see https://http.cat/status/507
     */
    InsufficientStorage507 = 507,
    /**
     * Indicates that the server terminated an operation because it encountered an infinite loop while processing a request
     * @see https://http.cat/status/508
     */
    LoopDetected508 = 508,
    /**
     * Sent in the context of the HTTP Extension Framework, defined in RFC 2774.
     * @see https://http.cat/status/510
     */
    NotExtended510 = 510,
    /**
     * Indicates that the client needs to authenticate to gain network access.
     * @see https://http.cat/status/511
     */
    NetworkAuthenticationRequired511 = 511
}

/**
 * Specifies the OS when selecting a predefined user agent
 */
export declare type OS = "Windows" | "macOS" | "Linux";

/**
 * Classifies the desired action to be performed on a resource.
 * - GET The request is for a representation of a resource. The server should only retrieve data; not modify state.
 * - POST The request is to process a resource in some way.
 * - PUT The request is to create or update a resource with the state in the request. A distinction from POST is that the client specifies the target location on the server.
 * - PATCH The request is to modify a resource according to its partial state in the request.
 * - DELETE The request is to delete a resource.
 */
declare type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

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
     * The user agent send to the server by defaulrt
     */
    userAgent: string;
    /**
     * The error handler that's executed if an error isn't handled previously
     * by an error-response specific handler
     */
    globalErrorHandler?: (e: any, res: (Response | undefined)) => void;
    /**
     * By default if the response is OK (2--) but the response body is falsy
     * SoFetch will coerce the response to 'true'. You can change this behaviour by
     * setting the `coerceEmptySuccessToTrue` property to false.
     */
    coerceEmptySuccessToTrue: boolean;
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
     * Adds a global error handler which will be executed if any request fails for any reason
     * and no request-specific or status-specific handler exists
     * @handler A function which accept an error (which could be anything) and
     * a Fetch Response as an argument
     */
    catch(handler: (e: any, res: (Response | undefined)) => void): void;
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
    /**
     * Tells SoFetch to use a specified user agent when making requests. You can either user a predefined user agent
     * by specifying an OS and browser or explicitly pass the user agent string you want to use.
     * @param browser - optional, required if OS is also passed. Ignored if userAgentString is passed.
     * @param OS - optional, required if browser is also passed. Ignored if userAgentString is passed.
     * @param userAgentString optional
     */
    setUserAgent({ browser, OS, userAgentString }: {
        browser?: Browser;
        OS?: OS;
        userAgentString?: string;
    }): void;
}

export declare interface SoFetchLike<TResponse = unknown> {
    verbose: boolean;
    config: SoFetchConfig;
    get<T>(url: string, body?: UploadPayload): SoFetchPromise<T | undefined>;
    post<T>(url: string, body?: UploadPayload): SoFetchPromise<T | undefined>;
    put<T>(url: string, body?: UploadPayload): SoFetchPromise<T | undefined>;
    patch<T>(url: string, body?: UploadPayload): SoFetchPromise<T | undefined>;
    delete<T>(url: string, body?: UploadPayload): SoFetchPromise<T | undefined>;
    request<T>(method: RequestMethod, url: string, body?: UploadPayload): SoFetchPromise<T | undefined>;
    <T>(url: string, body?: UploadPayload): SoFetchPromise<T | undefined>;
    instance(configOrAuthKey?: SoFetchConfig | string): SoFetchLike<TResponse>;
}

/**
 * An awaitable promise-like class that additionally allows event and error handlers to be attached to the HTTP request
 * @example
 *
 *    const unicorn = await soFetch("https://unicorns.com/1234")
 *      .beforeSend(req:SoFetchRequest) => {
 *          console.info(`Finding my unicorn at ${req.url}`)
 *       })
 *      .catchHttp(Status.NotFound404, (res:Response) => {
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
    coerceEmptySuccess?: boolean;
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
    catchHTTP(status: HttpStatus, handler: (response: Response) => void): SoFetchPromise<T>;
    /**
     * Sets a timeout value for this request only
     * @param ms
     */
    setTimeout(ms: number): SoFetchPromise<T>;
    /**
     * By default if the response is OK (2--) but the response body is falsy
     * SoFetch will coerce the response to 'true'. You can override the default behaviour
     * for this request by setting the `coerceEmptySuccessToTrue` value here
     */
    coerceEmptySuccessToTrue(b: boolean): SoFetchPromise<T>;
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

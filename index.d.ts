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
    errorHandlers: ErrorHandlerDict;
    beforeSendHandlers: ((request: SoFetchRequest) => SoFetchRequest | void)[];
    onRequestCompleteHandlers: ((response: Response, requestData: {
        duration: number;
        method: string;
    }) => void)[];
    /**
     * The base URL for all HTTP requests in the instance. If absent this is assumed to be the current base url.
     * If running in Node relative requests without a baseUrl will throw an error.
     */
    baseUrl: string;
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
     * Causes a basic authorization header to be sent with each request in this soFetch instance.
     * @param auth - The authentication object containing the username and password.
     * @param auth.username The username for basic authentication
     * @param auth.password The password for basic authentication
     * @example
     *
     *    soFetch.config.setBasicAuthentication({username:"Chris Hodges", password:"Antoinette"})
     *
     * @see For more examples see https://sofetch.antoinette.agency
     */
    setBasicAuthentication({ username, password }: {
        password: string;
        username: string;
    }): void;
    /**
     * Causes a bearer token authorization token to be sent with each request in this sofetch instance
     * @param token
     * @example
     *
     *    soFetch.config.setBearerToken("SOME_ACCESS_TOKEN")
     *
     * @see For more examples see https://sofetch.antoinette.agency
     */
    setBearerToken(token: string): void;
    /**
     * Causes a header with the specified key and value to be sent with each request in this sofetch instance
     * @param auth - The authentication object containing the header key and value.
     * @param auth.headerName The header key
     * @param auth.value The header value
     * @example
     *
     *    soFetch.config.setHeaderApiKey({headerName:"some-api-key", value:"HEADER_ACCESS_TOKEN"})
     *
     * @see For more examples see https://sofetch.antoinette.agency
     */
    setHeaderApiKey({ headerName, value }: {
        headerName: string;
        value: string;
    }): void;
    /**
     * Causes a query string entry with the specified key and value to be sent with each request in this sofetch instance
     * @param auth - The authentication object containing the header key and value.
     * @param auth.paramName The query string key
     * @param auth.value The query string value
     * @example
     *    soFetch.config.setQueryStringApiKey({paramName:"api-key", value:"QUERY_STRING_ACCESS_TOKEN"})
     * @see For more examples see https://sofetch.antoinette.agency
     */
    setQueryStringApiKey({ paramName, value }: {
        paramName: string;
        value: string;
    }): void;
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
    beforeSend(handler: (request: SoFetchRequest) => SoFetchRequest | void): void;
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
    }) => void): void;
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
    instance(): SoFetchLike<TResponse>;
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
    beforeSendHandlers: ((request: SoFetchRequest) => SoFetchRequest | void)[];
    beforeFetchSendHandlers: ((init: RequestInit) => RequestInit | void)[];
    onRequestCompleteHandlers: ((response: Response, requestData: {
        duration: number;
        method: string;
    }) => void)[];
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
    onRequestComplete(handler: (response: Response) => void): SoFetchPromise<T>;
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
    beforeSend(handler: (request: SoFetchRequest) => SoFetchRequest | void): SoFetchPromise<T>;
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
    beforeFetchSend(handler: (request: RequestInit) => RequestInit | void): SoFetchPromise<T>;
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

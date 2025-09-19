declare type ErrorHandlerDict = {
    [key: number]: Array<(r: Response) => void>;
};

declare const soFetch: SoFetchLike;
export default soFetch;

export declare class SoFetchConfig {
    errorHandlers: ErrorHandlerDict;
    beforeSendHandlers: ((request: SoFetchRequest) => SoFetchRequest | void)[];
    onRequestCompleteHandlers: ((response: Response, requestData: {
        duration: number;
        method: string;
    }) => void)[];
    baseUrl: string;
    addHTTPHandler(status: number, handler: (res: Response) => void): void;
    handleHttpError(response: Response): number;
    setBasicAuthentication({ username, password }: {
        password: string;
        username: string;
    }): void;
    setBearerToken(token: string): void;
    setHeaderApiKey({ headerName, value }: {
        headerName: string;
        value: string;
    }): void;
    setQueryStringApiKey({ paramName, value }: {
        paramName: string;
        value: string;
    }): void;
    beforeSend(handler: (request: SoFetchRequest) => SoFetchRequest | void): void;
    transformRequest(request: SoFetchRequest): SoFetchRequest;
    onRequestComplete(handler: (r: Response, metaData: {
        duration: number;
        method: string;
    }) => void): void;
}

export declare interface SoFetchLike<TResponse = unknown> {
    verbose: boolean;
    config: SoFetchConfig;
    get<T>(url: string, body?: object | File | File[]): SoFetchPromise<T>;
    post<T>(url: string, body?: object | File | File[]): SoFetchPromise<T>;
    put<T>(url: string, body?: object | File | File[]): SoFetchPromise<T>;
    patch<T>(url: string, body?: object | File | File[]): SoFetchPromise<T>;
    delete<T>(url: string, body?: object | File | File[]): SoFetchPromise<T>;
    <T extends TResponse = TResponse>(url: string, body?: object | File | File[]): SoFetchPromise<T>;
    instance(): SoFetchLike<TResponse>;
}

export declare class SoFetchPromise<T> extends EventTarget {
    private readonly inner;
    private errorHandlers;
    private beforeSendHandlers;
    private beforeFetchSendHandlers;
    timeout: number;
    then: Promise<T>["then"];
    catch: Promise<T>["catch"];
    finally: Promise<T>["finally"];
    constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void);
    onRequestComplete(handler: (response: Response) => void): SoFetchPromise<T>;
    beforeSend(handler: (request: SoFetchRequest) => SoFetchRequest | void): SoFetchPromise<T>;
    beforeFetchSend(handler: (request: RequestInit) => RequestInit | void): SoFetchPromise<T>;
    catchHTTP(status: number, handler: (response: Response) => void): SoFetchPromise<T>;
    handleHttpError(response: Response): number;
    transformRequest(request: SoFetchRequest): SoFetchRequest;
    transformInit(init: RequestInit): RequestInit;
    setTimeout(ms: number): Promise<this>;
}

export declare interface SoFetchRequest {
    url: string;
    method: string;
    body: object | undefined;
    headers: Record<string, string>;
}

export { }

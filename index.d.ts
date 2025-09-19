declare const soFetch: SoFetchLike;
export default soFetch;

export declare class SoFetchConfig {
    private errorHandlers;
    private beforeSendHandlers;
    constructor();
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
}

export declare interface SoFetchLike<TResponse = unknown> {
    verbose: boolean;
    config: SoFetchConfig;
    get<T>(url: string, body?: object): SoFetchPromise<T>;
    post<T>(url: string, body?: object): SoFetchPromise<T>;
    put<T>(url: string, body?: object): SoFetchPromise<T>;
    patch<T>(url: string, body?: object): SoFetchPromise<T>;
    delete<T>(url: string, body?: object): SoFetchPromise<T>;
    <T extends TResponse = TResponse>(url: string, body?: object | File | File[], files?: File | File[]): SoFetchPromise<T>;
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

declare interface SoFetchRequest {
    url: string;
    method: string;
    body: object | undefined;
    headers: Record<string, string>;
}

export { }

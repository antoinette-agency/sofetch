import {ErrorHandlerDict} from "./errorHandlerDict.ts";
import {SoFetchRequest} from "./soFetch.ts";

export class SoFetchPromise<T> extends EventTarget {
    private readonly inner: Promise<T>;
    private errorHandlers:ErrorHandlerDict = {}
    private beforeSendHandlers:((request:SoFetchRequest) => SoFetchRequest | void)[] = []
    private beforeFetchSendHandlers:((init:RequestInit) => RequestInit | void)[] = []
    timeout: number = 30000
    then: Promise<T>["then"];
    catch: Promise<T>["catch"];
    finally: Promise<T>["finally"];
    
    constructor(executor: (
        resolve: (value: T | PromiseLike<T>) => void,
        reject: (reason?: any) => void
    ) => void) {
        super();
        this.inner = new Promise(executor);
        // Bind promise methods once inner exists
        this.then = this.inner.then.bind(this.inner);
        this.catch = this.inner.catch.bind(this.inner);
        this.finally = this.inner.finally.bind(this.inner);
    }

    onRequestComplete(handler: (response: Response) => void): SoFetchPromise<T> {
        this.addEventListener("onRequestSuccess", e => {
            const event = e as CustomEvent<Response>;
            handler(event.detail)
        })
        return this
    }
    
    beforeSend(handler: (request: SoFetchRequest) => SoFetchRequest | void): SoFetchPromise<T> {
        this.beforeSendHandlers.push(handler)
        return this
    }

    beforeFetchSend(handler: (request: RequestInit) => RequestInit | void): SoFetchPromise<T> {
        this.beforeFetchSendHandlers.push(handler)
        return this
    }


    catchHTTP(status: number, handler: (response: Response) => void): SoFetchPromise<T> {
        if (!this.errorHandlers[status]) {
            this.errorHandlers[status] = []
        }
        this.errorHandlers[status].push(handler)
        return this
    }

    handleHttpError(response:Response) {
        const status = response.status
        const handled = this.errorHandlers[status] && this.errorHandlers[status].length
        if (handled) {
            this.errorHandlers[status].forEach(h => h(response))
        }
        return handled
    }

    transformRequest(request:SoFetchRequest):SoFetchRequest {
        this.beforeSendHandlers.forEach(h => {
            request = h(request) || request
        })
        return request
    }

    transformInit(init:RequestInit):RequestInit {
        this.beforeFetchSendHandlers.forEach(h => {
            init = h(init) || init
        })
        return init
    }

    async setTimeout(ms: number) {
        this.timeout = ms
        return this
    }
}
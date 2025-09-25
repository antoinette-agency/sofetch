import {ErrorHandlerDict} from "./errorHandlerDict.ts";
import {SoFetchRequest} from "./soFetch.ts";

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
export class SoFetchPromise<T> {
    private readonly inner: Promise<T>;
    errorHandlers:ErrorHandlerDict = {}
    beforeSendHandlers:((request:SoFetchRequest) => SoFetchRequest | void)[] = []
    beforeFetchSendHandlers:((init:RequestInit) => RequestInit | void)[] = []
    onRequestCompleteHandlers: ((response: Response, requestData: { duration: number, method: string }) => void)[] = []
    timeout: number = 30000
    then: Promise<T>["then"];
    catch: Promise<T>["catch"];
    finally: Promise<T>["finally"];
    
    constructor(executor: (
        resolve: (value: T | PromiseLike<T>) => void,
        reject: (reason?: any) => void
    ) => void) {
        this.inner = new Promise(executor);
        // Bind promise methods once inner exists
        this.then = this.inner.then.bind(this.inner);
        this.catch = this.inner.catch.bind(this.inner);
        this.finally = this.inner.finally.bind(this.inner);
    }

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
    onRequestComplete(handler: (response: Response) => void): SoFetchPromise<T> {
        this.onRequestCompleteHandlers.push(handler)
        return this
    }

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
    beforeSend(handler: (request: SoFetchRequest) => SoFetchRequest | void): SoFetchPromise<T> {
        this.beforeSendHandlers.push(handler)
        return this
    }

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
    beforeFetchSend(handler: (request: RequestInit) => RequestInit | void): SoFetchPromise<T> {
        this.beforeFetchSendHandlers.push(handler)
        return this
    }

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
    catchHTTP(status: number, handler: (response: Response) => void): SoFetchPromise<T> {
        if (!this.errorHandlers[status]) {
            this.errorHandlers[status] = []
        }
        this.errorHandlers[status].push(handler)
        return this
    }

    async setTimeout(ms: number) {
        this.timeout = ms
        return this
    }
}

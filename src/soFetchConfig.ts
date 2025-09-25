import {ErrorHandlerDict} from "./errorHandlerDict.ts";
import {SoFetchRequest} from "./soFetch.ts";

/**
 * Configures all requests for a specific soFetch instance
 */
export class SoFetchConfig {
    errorHandlers: ErrorHandlerDict = {}
    beforeSendHandlers: ((request: SoFetchRequest) => SoFetchRequest | void)[] = []
    onRequestCompleteHandlers: ((response: Response, requestData: { duration: number, method: string }) => void)[] = []

    /**
     * The base URL for all HTTP requests in the instance. If absent this is assumed to be the current base url.
     * If running in Node relative requests without a baseUrl will throw an error.
     */
    baseUrl: string = ""

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
    catchHTTP(status: number, handler: (res: Response) => void) {
        if (!this.errorHandlers[status]) {
            this.errorHandlers[status] = []
        }
        this.errorHandlers[status].push(handler)
    }

    /**
     * Causes a basic authorization header to be sent with each request in this soFetch instance.
     * @param username
     * @param password
     * @example
     *
     *    soFetch.config.setBasicAuthentication({username:"Chris Hodges", password:"Antoinette"})
     *
     * @see For more examples see https://sofetch.antoinette.agency
     */
    setBasicAuthentication({username, password}: { password: string; username: string }) {
        const token = btoa(`${username}:${password}`);
        const headerValue = `Basic ${token}`
        this.beforeSend((request: SoFetchRequest) => {
            request.headers["Authorization"] = headerValue
        })
    }

    /**
     * Causes a bearer token authorization token to be sent with each request in this sofetch instance
     * @param token
     * @example
     *
     *    soFetch.config.setBearerToken("SOME_ACCESS_TOKEN")
     *
     * @see For more examples see https://sofetch.antoinette.agency
     */
    setBearerToken(token: string) {
        this.beforeSend((request: SoFetchRequest) => {
            request.headers["Authorization"] = `Bearer ${token}`
        })
    }

    /**
     * Causes a header with the specified key and value to be sent with each request in this sofetch instance
     * @param headerName
     * @param value
     * @example
     * 
     *    soFetch.config.setHeaderApiKey({headerName:"some-api-key", value:"HEADER_ACCESS_TOKEN"})
     *    
     * @see For more examples see https://sofetch.antoinette.agency
     */
    setHeaderApiKey({headerName, value}: { headerName: string; value: string }) {
        this.beforeSend((request: SoFetchRequest) => {
            request.headers[headerName] = value
        })
    }

    /**
     * Causes a query string entry with the specified key and value to be sent with each request in this sofetch instance
     * @param paramName
     * @param value
     * @example
     *    soFetch.config.setQueryStringApiKey({paramName:"api-key", value:"QUERY_STRING_ACCESS_TOKEN"})
     * @see For more examples see https://sofetch.antoinette.agency
     */
    setQueryStringApiKey({paramName, value}: { paramName: string; value: string }) {
        this.beforeSend((request: SoFetchRequest) => {
            const url = new URL(request.url)
            url.searchParams.append(paramName, value)
            request.url = url.toString()
        })
    }

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
    beforeSend(handler: (request: SoFetchRequest) => SoFetchRequest | void) {
        this.beforeSendHandlers.push(handler)
    }

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
    onRequestComplete(handler: (r: Response, metaData: { duration: number, method: string }) => void) {
        this.onRequestCompleteHandlers.push(handler)
    }
}

import {ErrorHandlerDict} from "./errorHandlerDict.ts";
import {SoFetchRequest} from "./soFetch.ts";
import {getCookie, setCookie} from "./cookieTypescriptUtils.ts";
import {AuthTokenStorageType} from "./authTokenStorageType.ts";
import {AuthenticationType} from "./authenticationType.ts";

/**
 * Configures all requests for a specific soFetch instance
 */
export class SoFetchConfig {
    private errorHandlers: ErrorHandlerDict = {}
    protected beforeSendHandlers: ((request: SoFetchRequest) => Promise<SoFetchRequest | void> | SoFetchRequest | void)[] = []
    protected beforeFetchSendHandlers: ((request: RequestInit) => Promise<RequestInit | void> | RequestInit | void)[] = []
    protected onRequestCompleteHandlers: ((response: Response, requestData: { duration: number, method: string }) => Promise<void> | void)[] = []

    /**
     * Specifies how (or if) soFetch should persist and authentication
     */
    public authTokenStorage:AuthTokenStorageType = null
    private inMemoryAuthToken: string = ""

    /**
     * Specifies how soFetch should send authentication credentials to the server
     */
    public authenticationType:AuthenticationType = null
    
    protected getAuthToken = async () => {
        switch (this.authTokenStorage) {
            case null:
                return ""
            case "memory":
                return this.inMemoryAuthToken
            case "localStorage":
                return localStorage?.getItem(this.authenticationKey) || ""
            case "sessionStorage":
                return sessionStorage?.getItem(this.authenticationKey) || ""
            case "cookie":
                return getCookie(this.authenticationKey) || ""
            default:
                return this.authTokenStorage();
        }
    }

    /**
     * Use this method to set an auth token after it's been received from a server, typically as 
     * the response to a login request
     * @param authToken
     */
    public setAuthToken = (authToken:string) => {
        switch (this.authTokenStorage) {
            case "memory":
                this.inMemoryAuthToken = authToken
                break
            case "localStorage":
                localStorage.setItem(this.authenticationKey, authToken)
                break
            case "sessionStorage":
                sessionStorage.setItem(this.authenticationKey, authToken)
                break
            case "cookie":
                setCookie(this.authenticationKey, authToken)
                break
            /*If we're here there's authTokenStorage is either null or a custom function so
                there's nothing to do*/
            default:
                break
        }
    }
    
    /**
     * The base URL for all HTTP requests in the instance. If absent this is assumed to be the current base url.
     * If running in Node relative requests without a baseUrl will throw an error.
     */
    baseUrl: string = ""

    /**
     * The key which is used if an authentication token is persisted via cookies, localStorage or sessionStorage
     */
    authenticationKey: string = "SOFETCH_AUTHENTICATION"

    /**
     * The key which is used if an authentication token is sent to the server via a custom header
     */
    authHeaderKey: string = ""

    /**
     * The key which is used if an authentication token is sent to the server via the query string
     */
    authQueryStringKey: string = ""

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
    beforeSend(handler: (request: SoFetchRequest) => Promise<SoFetchRequest | void> | SoFetchRequest | void) {
        this.beforeSendHandlers.push(handler)
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
    beforeFetchSend(handler: (request: RequestInit) => Promise<RequestInit | void> | RequestInit | void) {
        this.beforeFetchSendHandlers.push(handler)
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
    onRequestComplete(handler: (r: Response, metaData: { duration: number, method: string }) => void | Promise<void>) {
        this.onRequestCompleteHandlers.push(handler)
    }
    
    private setAuthTokenStorage = (authTokenStorage?:AuthTokenStorageType) => {
        this.authTokenStorage = authTokenStorage === null ? null : (authTokenStorage || typeof(document) === "undefined" ? "memory" : "cookie")
    }

    /**
     * Tells soFetch to use [bearer authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication#bearer) to send an authentication token to the server
     * @param authToken - optional. Use this if you have already obtained a token from a login process. Typically this would be left undefined for bearer authentication as the token is usually obtained from a login process.
     * @param authenticationKey - optional. Specify an authentication key if you don't want to use the default: 'SOFETCH_AUTHENTICATION'
     * @param authTokenStorage - optional, defaults to 'localStorage' on the browser and 'memory' in Node
     */
    useBearerAuthentication({authToken, authenticationKey, authTokenStorage}:{
        authenticationKey?:string,
        authTokenStorage?:AuthTokenStorageType,
        authToken?:string,
    }) {
        this.authenticationType = "bearer"
        if (authenticationKey) {
            this.authenticationKey = authenticationKey
        }
        this.setAuthTokenStorage(authTokenStorage)
        if (authToken) {
            this.setAuthToken(authToken)
        }
    }

    /**
     * Tells soFetch to authenticate using cookies.
     * @param authToken - optional. Use this if you have already obtained a token. Typically this would be left undefined for bearer authentication as the token is usually obtained from a login process.
     * @param authenticationKey - optional. Specify an authentication key if you don't want to use the default: 'SOFETCH_AUTHENTICATION'
     */
    useCookieAuthentication(props?:{
        authenticationKey?:string,
        authToken?:string,
    }|undefined) {
        this.authenticationType = "cookies"
        let authenticationKey, authToken
        if (props) {
            authenticationKey = props.authenticationKey
            authToken = props.authToken
        }
        if (authenticationKey) {
            this.authenticationKey = authenticationKey
        }
        
        //If we're in Node we'll simulate memories in cookies.
        this.authTokenStorage =  typeof(document) === "undefined" ? "memory" : "cookie"
        if (authToken) {
            this.setAuthToken(authToken)
        }
    }

    /**
     * Tells soFetch to send an authentication token to the server 
     * @param headerKey - required. The key of the header with which to send the authentication token
     * @param authToken - optional. Use this if you have already obtained a token.
     * @param authenticationKey - optional. Specify an authentication key if you don't want to use the default: 'SOFETCH_AUTHENTICATION'
     * @param authTokenStorage - optional, defaults to 'localStorage' on the browser and 'memory' in Node
     */
    useHeaderAuthentication({headerKey, authToken, authenticationKey, authTokenStorage}:{
        headerKey:string,
        authenticationKey?:string,
        authToken?:string,
        authTokenStorage?:AuthTokenStorageType
    }) {
        this.authenticationType = "header"
        this.authHeaderKey = headerKey
        if (authenticationKey) {
            this.authenticationKey = authenticationKey
        }
        this.setAuthTokenStorage(authTokenStorage)
        if (authToken) {
            this.setAuthToken(authToken)
        }
    }

    /**
     * Tells soFetch to send append an authentication token to the request query string
     * @param queryStringKey - required. The key of the query string item with which to send the authentication token
     * @param authToken - optional. Use this if you have already obtained a token.
     * @param authenticationKey - optional. Specify an authentication key if you don't want to use the default: 'SOFETCH_AUTHENTICATION'
     * @param authTokenStorage - optional. Defaults to 'localStorage' on the browser and 'memory' in Node
     */
    useQueryStringAuthentication({queryStringKey, authToken, authenticationKey, authTokenStorage}:{
        queryStringKey:string,
        authenticationKey?:string,
        authToken?:string,
        authTokenStorage?:AuthTokenStorageType
    }) {
        this.authenticationType = "queryString"
        this.authQueryStringKey = queryStringKey
        if (authenticationKey) {
            this.authenticationKey = authenticationKey
        }
        this.setAuthTokenStorage(authTokenStorage)
        if (authToken) {
            this.setAuthToken(authToken)
        }
    }

    /**
     * Tells soFetch to use [basic authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication#basic) when communicating with the server
     * @param username - optional but required is password is used. Use this if you've already obtained a username and password.
     * @param password - optional but required is username is used. Use this if you've already obtained a username and password.
     * @param authenticationKey - optional. Specify an authentication key if you don't want to use the default: 'SOFETCH_AUTHENTICATION'
     * @param authTokenStorage - optional, defaults to 'localStorage' on the browser and 'memory' in Node
     */
    useBasicAuthentication({username, password, authenticationKey, authTokenStorage}:{
        username?:string, 
        password?:string,
        authenticationKey?:string,
        authTokenStorage?:AuthTokenStorageType
    }) {
        this.authenticationType = "basic"
        if ((username && !password) || (password && !username)) {
            console.warn("Was expecting both username and password to be set for soFetch.config.useBasicAuthentication. Continuing but authentication may not behave as expected")
        }
        if (authenticationKey) {
            this.authenticationKey = authenticationKey
        }
        this.setAuthTokenStorage(authTokenStorage)
        if (username && password) {
            this.setBasicAuthCredentials({username, password})
        }
    }
    
    private setBasicAuthCredentials({username, password}: {password: string; username: string}) {
        const token = btoa(`${username}:${password}`);
        this.setAuthToken(token)
    }
}

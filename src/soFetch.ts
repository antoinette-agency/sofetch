import {SoFetchConfig} from "./soFetchConfig";
import {SoFetchPromise} from "./soFetchPromise";
import {sleep} from "./sleep";

export interface SoFetchOptions {
    cacheSeconds?: number
}

export type SoFetchLike<TResponse = unknown> = {
    verbose: boolean;
    config: SoFetchConfig;
    get<T>(url: string, body?: object, options?: SoFetchOptions):SoFetchPromise<T>;
    post<T>(url: string, body?: object, options?: SoFetchOptions):SoFetchPromise<T>;
    put<T>(url: string, body?: object, options?: SoFetchOptions):SoFetchPromise<T>;
    patch<T>(url: string, body?: object, options?: SoFetchOptions):SoFetchPromise<T>;
    delete<T>(url: string, body?: object, options?: SoFetchOptions):SoFetchPromise<T>;
    <T extends TResponse = TResponse>(url: string, body?: object, options?: SoFetchOptions): SoFetchPromise<T>;
};

const makeRequestWrapper = <TResponse>(method:string, url:string, body:object | undefined) => {
    const promise = new SoFetchPromise<TResponse>((resolve, reject) => {
        (async () => {
            const headers = {}
            let request = {url, method, body, headers}
            request.url = !soFetch.config.baseUrl || request.url.startsWith("http") ? request.url : `${soFetch.config.baseUrl}${request.url}`
            await sleep(0) //Allows the promise to be initialised
            request = promise.transformRequest(request)
            request = soFetch.config.transformRequest(request)
            
            const response = await makeRequest(request)
            promise.dispatchEvent(new CustomEvent("onRequestSuccess", {detail:response}))
            if (!response.ok) {
                const requestHandled = promise.handleHttpError(response)
                const configHandled = soFetch.config.handleHttpError(response)
                if (!requestHandled && !configHandled) {
                    throw new Error(`Received response ${response.status} from URL ${response.url}`, {cause: response})
                }
            }
            const returnObject = await handleResponse(response)
            resolve(returnObject)
        })().catch(e => {
            reject(e)
        })
    })
    return promise
}

export interface SoFetchRequest {
    url:string,
    method:string,
    body:object | undefined
    headers:Record<string,string>
}

const makeRequest = async(request:SoFetchRequest) => {
    const {url, method, body} = request
    request.headers['content-type'] = 'application/json'
    return await fetch(url, {
        body: body ? JSON.stringify(body) : undefined,
        headers: request.headers,
        method,
        credentials: "include"
    })
}

const handleResponse = async (response:Response) => {

    if (response.status === 203) {
        return undefined
    }

    const responseBody = await response.text();
    if (!responseBody) {
        return undefined
    }
    let responseObject: any = responseBody
    try {
        responseObject = JSON.parse(responseBody);
    } catch {
    }

    return responseObject
}

const soFetch = (<TResponse>(url: string, body?: object, options?: SoFetchOptions): SoFetchPromise<TResponse> => {
    
    return makeRequestWrapper<TResponse>(body ? "POST" : "GET", url,  body)

}) as SoFetchLike;

soFetch.verbose = false;
soFetch.config = soFetch.config || new SoFetchConfig()

soFetch.get = (url: string, body?: object, options?: SoFetchOptions) => {
    return makeRequestWrapper("GET", url, body)
}

soFetch.post = (url: string, body?: object, options?: SoFetchOptions) => {
    return makeRequestWrapper("POST", url, body)
}

soFetch.put = (url: string, body?: object, options?: SoFetchOptions) => {
    return makeRequestWrapper("PUT", url, body)
}

soFetch.patch = (url: string, body?: object, options?: SoFetchOptions) => {
    return makeRequestWrapper("PATCH", url, body)
}

soFetch.delete = (url: string, body?: object, options?: SoFetchOptions) => {
    return makeRequestWrapper("DELETE", url, body)
}

export default soFetch;

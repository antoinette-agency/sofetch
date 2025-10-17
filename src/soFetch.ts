import {SoFetchConfig} from "./soFetchConfig.ts";
import {SoFetchPromise} from "./soFetchPromise.ts";
import {sleep} from "./sleep.ts";
import {UploadPayload} from "./uploadPayload.ts";
import {normalisePayload} from "./getPayloadType.ts";
import {FileWithFieldName} from "./fileWithFieldName.ts";
import {SoFetchLike} from "./soFetchLike.ts";
import {handleHttpErrors} from "./handleHttpErrors.ts";
import {transformRequest} from "./transformRequest.ts";
import {handleBeforeFetchSend} from "./handleBeforeFetchSend.ts";

async function addAuthentication(request: SoFetchRequest, config: SoFetchConfig) {
    
    const token = config.authenticationType === null ? "" : await config["getAuthToken"]()
    
    if (!token) {
        return request
    }
    
    switch(config.authenticationType) {
        case null:
            return request;
        case "basic":
            request.headers["Authorization"] = `Basic ${token}`
            return request;
        case "bearer":
            request.headers["Authorization"] = `Bearer ${token}`
            return request;
        case "header":
            request.headers[config.authHeaderKey] = token
            return request;
        case "queryString":
            const url = new URL(request.url)
            url.searchParams.append(config.authQueryStringKey, token)
            request.url = url.toString()
            return request;
        case "cookies":
            if (typeof document === "undefined") {
                request.headers['Cookie'] = `${config.authenticationKey}=${token}`
            }
            return request
    }
}

/** @import { UploadPayload } from "./uploadPayload.ts" */

const convertArgsToFetchInit = async <T>({url, method, body, config, promise}: { url: string, method:string, body?:UploadPayload, config:SoFetchConfig, promise:SoFetchPromise<T> }) => {
    const headers = {}
    let request = {url, method, body, headers}
    request.url = !config.baseUrl || request.url.startsWith("http") ? request.url : `${config.baseUrl}${request.url}`
    request = await addAuthentication(request, config)
    request = await transformRequest(request, promise.beforeSendHandlers)
    request = await transformRequest(request, config["beforeSendHandlers"])
    const {files} = normalisePayload(request.body)
    const sendCookies = config.authenticationType === "cookies"
    let init = files ? makeFilesRequest(request, files, sendCookies) : makeJsonRequest(request, sendCookies)
    init = await handleBeforeFetchSend(init, promise.beforeFetchSendHandlers)
    init = await handleBeforeFetchSend(init, config["beforeFetchSendHandlers"])
    return {init, finalUrl:request.url}
}

const makeRequestWrapper = <TResponse>(config: SoFetchConfig, method:string, url:string, body?:UploadPayload) => {
    const promise = new SoFetchPromise<TResponse>((resolve, reject) => {
        (async () => {
            await sleep(0) //Allows the promise to be initialised
            const {finalUrl, init} = await convertArgsToFetchInit({url, method, body, config, promise})
            
            const startTime = new Date().getTime()
            const response = await Promise.race([
                fetch(finalUrl, init),
                new Promise<Response>((_, reject) =>
                    setTimeout(() => reject(new Error("SoFetch timed out")), promise.timeout)
                )
            ]);
            const duration = new Date().getTime() - startTime
            
            if (soFetch.verbose) {
                console.info(`SoFetch: ${method} ${response.status} ${finalUrl}`)
            }
            for(const h of promise["onRequestCompleteHandlers"]) {
                await h(response, {duration, method:init.method || ""})
            }
            for(const h of config["onRequestCompleteHandlers"]) {
                await h(response, {duration, method:init.method || ""})
            }
            if (!response.ok) {
                const requestHandled = handleHttpErrors(response, promise.errorHandlers)
                let configHandled = false
                if (!requestHandled) {
                    configHandled = handleHttpErrors(response, config["errorHandlers"])
                }
                if (!requestHandled && !configHandled) {
                    // @ts-ignore
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

const makeJsonRequest = (request: SoFetchRequest, sendCookies: boolean):RequestInit => {
    const { method, body} = request
    if (body) {
        request.headers['Content-Type'] = 'application/json'
    }
    const init:RequestInit = {
        body: body ? JSON.stringify(body) : undefined,
        headers: request.headers,
        method,
        credentials:sendCookies ? "include" : undefined
    }
    return init
}

const makeFilesRequest = (request: SoFetchRequest, files: FileWithFieldName[], sendCookies: boolean):RequestInit => {
    const {method, headers} = request
    const formData = new FormData()
    files.forEach(f => {
        formData.append(f.fieldName, f.file, f.file.name)
    })
    const init:RequestInit = {
        body: formData,
        headers,
        method,
        credentials:sendCookies ? "include" : undefined
    }
    return init
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
const soFetch = (<TResponse>(url: string, body?: UploadPayload): SoFetchPromise<TResponse> => {
    return makeRequestWrapper<TResponse>(soFetch.config || new SoFetchConfig(), body ? "POST" : "GET", url,  body)
}) as SoFetchLike;

soFetch.verbose = false;


soFetch.config = new SoFetchConfig()

/**
 * Makes a GET request to the specified URL
 * @template TResponse The primitive or object type you're expecting from the server
 * @param url An absolute or relative URL
 * @returns An awaitable SoFetchPromise which resolves to type TResponse
 * @example
 *
 *    const products = await soFetch.get<Product[]>("/api/products")
 *
 * @see For more examples see https://sofetch.antoinette.agency
 */
soFetch.get = (url: string) => {
    return makeRequestWrapper( soFetch.config,"GET", url)
}

/**
 * Makes a POST request to the specified URL
 * @template TResponse The primitive or object type you're expecting from the server
 * @param url An absolute or relative URL
 * @param {UploadPayload} [body] The body of the request
 * @returns An awaitable SoFetchPromise which resolves to type TResponse
 * @example
 *
 *    const newUser = {
 *        name:"Regina George",
 *        email:"regina@massive-deal.com"
 *    }
 *    const successResponse = await soFetch.post<Success>("/api/users", newUser)
 *
 * @see For more examples see https://sofetch.antoinette.agency
 */
soFetch.post = (url: string, body?: object) => {
    return makeRequestWrapper(soFetch.config,"POST", url, body)
}

/**
 * Makes a PUT request to the specified URL
 * @template TResponse The primitive or object type you're expecting from the server
 * @param url An absolute or relative URL
 * @param {UploadPayload} [body] The body of the request
 * @returns An awaitable SoFetchPromise which resolves to type TResponse
 * @example
 *
 *    const upsertUser = {
 *        name:"Regina George",
 *        email:"regina@massive-deal.com"
 *    }
 *    const successResponse = await soFetch.put<Success>("/api/users/1234", upsertUser)
 *
 * @see For more examples see https://sofetch.antoinette.agency
 */
soFetch.put = (url: string, body?: object) => {
    return makeRequestWrapper(soFetch.config,"PUT", url, body)
}

/**
 * Makes a PATCH request to the specified URL
 * @template TResponse The primitive or object type you're expecting from the server
 * @param url An absolute or relative URL
 * @param {UploadPayload} [body] The body of the request
 * @returns An awaitable SoFetchPromise which resolves to type TResponse
 * @example
 *
 *    const updateUserEmail = {
 *        email:"regina@massive-deal.com"
 *    }
 *    const successResponse = await soFetch.patch<Success>("/api/users/1234", updateUserEmail)
 *
 * @see For more examples see https://sofetch.antoinette.agency
 */
soFetch.patch = (url: string, body?: object) => {
    return makeRequestWrapper(soFetch.config,"PATCH", url, body)
}

/**
 * Makes a DELETE request to the specified URL
 * @template TResponse The primitive or object type you're expecting from the server
 * @param url An absolute or relative URL
 * @returns An awaitable SoFetchPromise which resolves to type TResponse
 * @example
 *
 *    await soFetch.delete("/api/users/1234")
 *
 * @see For more examples see https://sofetch.antoinette.agency
 */
soFetch.delete = (url: string) => {
    return makeRequestWrapper(soFetch.config,"DELETE", url)
}

function generateNewAuthenticationKey(authenticationKey: string) {
    const regex = /^(.*?)([0-9]+)?$/;
    const match = authenticationKey.match(regex);
    const match1 = match ? match[1] : null
    const match2 = match ? match[2] : null
    if (!match1) {
        return authenticationKey
    }
    let next = match2 ? (parseInt(match2) + 1) : 1
    return `${match1}${next}`;
}

/**
 * Returns an independent instance of soFetch configured as per the original. The baseUrl and event handlers
 * will be copied over.
 * @see For examples see https://sofetch.antoinette.agency
 */
soFetch.instance = (configOrAuthKey?:SoFetchConfig | string) => {
    
    const configWasPassed = !!configOrAuthKey && typeof configOrAuthKey !== "string"
    const oldConfig = configWasPassed ? (configOrAuthKey as SoFetchConfig) : soFetch.config
    const newConfig = new SoFetchConfig()
    const newAuthKey = typeof configOrAuthKey == "string" ? (configOrAuthKey as string) : undefined
    if (!configWasPassed) {
        newConfig.baseUrl = oldConfig.baseUrl
        newConfig["beforeSendHandlers"] = [...oldConfig["beforeSendHandlers"]]
        newConfig["beforeFetchSendHandlers"] = [...oldConfig["beforeFetchSendHandlers"]]
        newConfig["onRequestCompleteHandlers"] = [...oldConfig["onRequestCompleteHandlers"]]
        newConfig.authTokenStorage = oldConfig.authTokenStorage
        newConfig["inMemoryAuthToken"] = oldConfig["inMemoryAuthToken"]
    }
    newConfig.authenticationKey = newAuthKey || generateNewAuthenticationKey(oldConfig.authenticationKey)
    
    const soFetchInstance = (<TResponse>(url: string, body?: UploadPayload): SoFetchPromise<TResponse> => {
        return makeRequestWrapper<TResponse>(newConfig,body ? "POST" : "GET", url,  body)
    }) as SoFetchLike;
    soFetchInstance.get = (url: string, body?: UploadPayload) => {
        return makeRequestWrapper(newConfig, "GET", url, body)
    }
    soFetchInstance.post = (url: string, body?: UploadPayload) => {
        return makeRequestWrapper(newConfig,"POST", url, body)
    }
    soFetchInstance.put = (url: string, body?: UploadPayload) => {
        return makeRequestWrapper(newConfig,"PUT", url, body)
    }
    soFetchInstance.patch = (url: string, body?: UploadPayload) => {
        return makeRequestWrapper(newConfig,"PATCH", url, body)
    }
    soFetchInstance.delete = (url: string, body?: UploadPayload) => {
        return makeRequestWrapper(newConfig,"DELETE", url, body)
    }
    soFetchInstance.verbose = soFetch.verbose
    soFetchInstance.config = newConfig
    soFetchInstance.instance = (c?:SoFetchConfig) => {
        return soFetch.instance(c || newConfig)
    }
    return soFetchInstance
}

export default soFetch;

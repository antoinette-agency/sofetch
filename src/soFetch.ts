import {SoFetchConfig} from "./soFetchConfig.ts";
import {SoFetchPromise} from "./soFetchPromise.ts";
import {sleep} from "./sleep.ts";
import {UploadPayload} from "./uploadPayload.ts";
import {normalisePayload} from "./getPayloadType.ts";
import {FileWithFieldName} from "./fileWithFieldName.ts";
import {SoFetchLike} from "./soFetchLike.ts";

const makeRequestWrapper = <TResponse>(config: SoFetchConfig, method:string, url:string, body?:UploadPayload) => {
    const promise = new SoFetchPromise<TResponse>((resolve, reject) => {
        (async () => {
            const headers = {}
            let request = {url, method, body, headers}
            request.url = !config.baseUrl || request.url.startsWith("http") ? request.url : `${config.baseUrl}${request.url}`
            await sleep(0) //Allows the promise to be initialised
            request = promise.transformRequest(request)
            request = config.transformRequest(request)
            const {files, jsonPayload} = normalisePayload(request.body)
            let init = files ? makeFilesRequest(request, files) : makeJsonRequest(request)
            init = promise.transformInit(init)
            
            const startTime = new Date().getTime()
            const response = await Promise.race([
                fetch(request.url, init),
                new Promise<Response>((_, reject) =>
                    setTimeout(() => reject(new Error("SoFetch timed out")), promise.timeout)
                )
            ]);
            const duration = new Date().getTime() - startTime
            if (soFetch.verbose) {
                console.info(`SoFetch: ${init.method} ${response.status} ${request.url}`)
            }
            promise.dispatchEvent(new CustomEvent("onRequestSuccess", {detail:response}))
            config.onRequestCompleteHandlers.forEach(h => {
                h(response, {duration, method:request.method})
            })
            if (!response.ok) {
                const requestHandled = promise.handleHttpError(response)
                const configHandled = config.handleHttpError(response)
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

const makeJsonRequest = (request:SoFetchRequest):RequestInit => {
    const {url, method, body} = request
    request.headers['content-type'] = 'application/json'
    const init = {
        body: body ? JSON.stringify(body) : undefined,
        headers: request.headers,
        method,
        credentials: "include" as RequestCredentials
    }
    return init
}

const makeFilesRequest = (request:SoFetchRequest, files:FileWithFieldName[]):RequestInit => {
    const {method, headers} = request
    const formData = new FormData()
    files.forEach(f => {
        formData.append(f.fieldName, f.file, f.file.name)
    })
    const init = {
        body: formData,
        headers,
        method,
        credentials: "include" as RequestCredentials
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
 * Makes an HTTP request to the specified URL. If no body is passed this will be a GET request.
 * If a body is passed this will be a POST request.
 * 
 * To make PUT, PATCH and DELETE requests use soFetch.put(), soFetch.patch() and soFetch.delete() respectively.
 */
const soFetch = (<TResponse>(url: string, body?: object | File | File[]): SoFetchPromise<TResponse> => {
    return makeRequestWrapper<TResponse>(soFetch.config || new SoFetchConfig(), body ? "POST" : "GET", url,  body)
}) as SoFetchLike;

soFetch.verbose = false;
soFetch.config = new SoFetchConfig()

soFetch.get = (url: string, body?: object) => {
    return makeRequestWrapper( soFetch.config,"GET", url, body)
}

soFetch.post = (url: string, body?: object) => {
    return makeRequestWrapper(soFetch.config,"POST", url, body)
}

soFetch.put = (url: string, body?: object) => {
    return makeRequestWrapper(soFetch.config,"PUT", url, body)
}

soFetch.patch = (url: string, body?: object) => {
    return makeRequestWrapper(soFetch.config,"PATCH", url, body)
}

soFetch.delete = (url: string, body?: object) => {
    return makeRequestWrapper(soFetch.config,"DELETE", url, body)
}

soFetch.instance = () => {
    
    const config = new SoFetchConfig()
    config.baseUrl = soFetch.config.baseUrl
    config.beforeSendHandlers = [...soFetch.config.beforeSendHandlers]
    config.onRequestCompleteHandlers = [...soFetch.config.onRequestCompleteHandlers]
    
    const soFetchInstance = (<TResponse>(url: string, body?: object | File | File[]): SoFetchPromise<TResponse> => {
        return makeRequestWrapper<TResponse>(config,body ? "POST" : "GET", url,  body)
    }) as SoFetchLike;
    soFetchInstance.get = (url: string, body?: object | File | File[]) => {
        return makeRequestWrapper(config, "GET", url, body)
    }
    soFetchInstance.post = (url: string, body?: object | File | File[]) => {
        return makeRequestWrapper(config,"POST", url, body)
    }
    soFetchInstance.put = (url: string, body?: object | File | File[]) => {
        return makeRequestWrapper(config,"PUT", url, body)
    }
    soFetchInstance.patch = (url: string, body?: object | File | File[]) => {
        return makeRequestWrapper(config,"PATCH", url, body)
    }
    soFetchInstance.delete = (url: string, body?: object | File | File[]) => {
        return makeRequestWrapper(config,"DELETE", url, body)
    }
    soFetchInstance.verbose = soFetch.verbose
    soFetchInstance.config = config
    return soFetchInstance
}

export default soFetch;

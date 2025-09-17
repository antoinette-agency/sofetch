import {SoFetchConfig} from "./soFetchConfig";
import {SoFetchPromise} from "./soFetchPromise";
import {sleep} from "./sleep";
import {UploadPayload} from "./uploadPayload";
import {FilesPayload} from "./filesPayload";
import {getPayloadType, normalisePayload} from "./getPayloadType";
import {FileWithFieldName} from "./fileWithFieldName";

export type SoFetchLike<TResponse = unknown> = {
    verbose: boolean;
    config: SoFetchConfig;
    get<T>(url: string, body?: object):SoFetchPromise<T>;
    post<T>(url: string, body?: object):SoFetchPromise<T>;
    put<T>(url: string, body?: object):SoFetchPromise<T>;
    patch<T>(url: string, body?: object):SoFetchPromise<T>;
    delete<T>(url: string, body?: object):SoFetchPromise<T>;
    <T extends TResponse = TResponse>(url: string, body?: object | File | File[], files?:File | File[]): SoFetchPromise<T>;
};

const makeRequestWrapper = <TResponse>(method:string, url:string, body?:UploadPayload, files?:FilesPayload) => {
    const promise = new SoFetchPromise<TResponse>((resolve, reject) => {
        (async () => {
            const headers = {}
            let request = {url, method, body, headers}
            request.url = !soFetch.config.baseUrl || request.url.startsWith("http") ? request.url : `${soFetch.config.baseUrl}${request.url}`
            await sleep(0) //Allows the promise to be initialised
            request = promise.transformRequest(request)
            request = soFetch.config.transformRequest(request)
            const {files, jsonPayload} = normalisePayload(request.body)
            let init = files ? makeFilesRequest(request, files) : makeJsonRequest(request)
            init = promise.transformInit(init)


            const response = await Promise.race([
                fetch(request.url, init),
                new Promise<Response>((_, reject) =>
                    setTimeout(() => reject(new Error("SoFetch timed out")), promise.timeout)
                )
            ]);
            
            
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

const soFetch = (<TResponse>(url: string, body?: object | File | File[], files?:File | File[]): SoFetchPromise<TResponse> => {
    return makeRequestWrapper<TResponse>(body ? "POST" : "GET", url,  body)
}) as SoFetchLike;

soFetch.verbose = false;
soFetch.config = soFetch.config || new SoFetchConfig()

soFetch.get = (url: string, body?: object) => {
    return makeRequestWrapper("GET", url, body)
}

soFetch.post = (url: string, body?: object) => {
    return makeRequestWrapper("POST", url, body)
}

soFetch.put = (url: string, body?: object) => {
    return makeRequestWrapper("PUT", url, body)
}

soFetch.patch = (url: string, body?: object) => {
    return makeRequestWrapper("PATCH", url, body)
}

soFetch.delete = (url: string, body?: object) => {
    return makeRequestWrapper("DELETE", url, body)
}

export default soFetch;

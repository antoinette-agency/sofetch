import {ErrorHandlerDict} from "./errorHandlerDict.ts";
import {SoFetchRequest} from "./soFetch.ts";

export class SoFetchConfig {
    errorHandlers:ErrorHandlerDict = {}
    beforeSendHandlers:((request:SoFetchRequest) => SoFetchRequest | void)[] = []
    onRequestCompleteHandlers:((response:Response, requestData:{duration:number, method:string}) => void)[] = []
    baseUrl: string = ""

    addHTTPHandler(status: number, handler: (res: Response) => void) {
        if (!this.errorHandlers[status]) {
            this.errorHandlers[status] = []
        }
        this.errorHandlers[status].push(handler)
    }

    handleHttpError(response: Response) {
        const status = response.status
        const handled = this.errorHandlers[status] && this.errorHandlers[status].length
        if (handled) {
            this.errorHandlers[status].forEach(h => h(response))
        }
        return handled
    }

    setBasicAuthentication({username, password}: {password: string; username: string}) {
        const token = btoa(`${username}:${password}`);
        const headerValue = `Basic ${token}`
        this.beforeSend((request: SoFetchRequest) => {
            request.headers["Authorization"] = headerValue
        })
    }

    setBearerToken(token: string) {
        this.beforeSend((request: SoFetchRequest) => {
            request.headers["Authorization"] = `Bearer ${token}`
        })
    }

    setHeaderApiKey({headerName, value}: {headerName: string; value: string}) {
        this.beforeSend((request: SoFetchRequest) => {
            request.headers[headerName] = value
        })
    }

    setQueryStringApiKey({paramName, value}: { paramName: string; value: string }) {
        this.beforeSend((request: SoFetchRequest) => {
            const url = new URL(request.url)
            url.searchParams.append(paramName, value)
            request.url = url.toString()
        })
    }

    beforeSend(handler: (request: SoFetchRequest) => SoFetchRequest | void) {
        this.beforeSendHandlers.push(handler)
    }

    transformRequest(request:SoFetchRequest):SoFetchRequest {
        this.beforeSendHandlers.forEach(h => {
            request = h(request) || request
        })
        return request
    }

    onRequestComplete(handler: (r: Response, metaData:{duration:number, method:string}) => void) {
        this.onRequestCompleteHandlers.push(handler)
    }
}
import {SoFetchRequest} from "./soFetch.ts";

export const transformRequest = (request: SoFetchRequest, beforeSendHandlers: ((request: SoFetchRequest) => SoFetchRequest | void)[]) => {
    beforeSendHandlers.forEach(h => {
        request = h(request) || request
    })
    return request
}
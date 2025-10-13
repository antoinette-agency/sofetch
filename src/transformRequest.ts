import {SoFetchRequest} from "./soFetch.ts";

export const transformRequest = async (request: SoFetchRequest, beforeSendHandlers: ((request: SoFetchRequest) => Promise<SoFetchRequest | void> | SoFetchRequest | void)[]) => {
    for(const h of beforeSendHandlers) {
        request = (await h(request)) || request
    }
    return request
}
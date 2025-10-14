export const handleBeforeFetchSend = async (init: RequestInit, handlers: ((init: RequestInit) => Promise<RequestInit | void> | RequestInit | void)[]) => {
    for(const h of handlers) {
        init = (await h(init)) || init
    }
    return init
}
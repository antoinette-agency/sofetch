export const handleBeforeFetchSend = (init: RequestInit, handlers: ((init: RequestInit) => RequestInit | void)[]) => {
    handlers.forEach(h => {
        init = h(init) || init
    })
    return init
}
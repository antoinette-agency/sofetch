import {ErrorHandlerDict} from "./errorHandlerDict.ts";

export const handleHttpErrors = (response: Response, errorHandlers: ErrorHandlerDict) => {
    const status = response.status
    const handled = !!(errorHandlers[status] && errorHandlers[status].length)
    if (handled) {
        errorHandlers[status].forEach(h => h(response))
    }
    return handled
}
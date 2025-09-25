/**
 * A integer-keyed dictionary of arrays of response handlers.
 */
export type ErrorHandlerDict = {
    [key: number]: Array<(r: Response) => void>;
};
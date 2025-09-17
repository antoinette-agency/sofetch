export type ErrorHandlerDict = {
    [key: number]: Array<(r: Response) => void>;
};
import {SoFetchConfig} from "./soFetchConfig.ts";
import {SoFetchPromise} from "./soFetchPromise.ts";

export interface SoFetchLike<TResponse = unknown> {
    verbose: boolean;
    config: SoFetchConfig;

    get<T>(url: string, body?: object | File | File[]): SoFetchPromise<T>;

    post<T>(url: string, body?: object | File | File[]): SoFetchPromise<T>;

    put<T>(url: string, body?: object | File | File[]): SoFetchPromise<T>;

    patch<T>(url: string, body?: object | File | File[]): SoFetchPromise<T>;

    delete<T>(url: string, body?: object | File | File[]): SoFetchPromise<T>;

    <T extends TResponse = TResponse>(url: string, body?: object | File | File[]): SoFetchPromise<T>;

    instance(): SoFetchLike<TResponse>;
}
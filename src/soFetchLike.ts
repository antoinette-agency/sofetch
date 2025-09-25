import {SoFetchConfig} from "./soFetchConfig.ts";
import {SoFetchPromise} from "./soFetchPromise.ts";
import {FileWithFieldName} from "./fileWithFieldName.ts";
import {UploadPayload} from "./uploadPayload.ts";

export interface SoFetchLike<TResponse = unknown> {
    verbose: boolean;
    config: SoFetchConfig;

    get<T>(url: string, body?: UploadPayload): SoFetchPromise<T>;

    post<T>(url: string, body?: UploadPayload): SoFetchPromise<T>;

    put<T>(url: string, body?: UploadPayload): SoFetchPromise<T>;

    patch<T>(url: string, body?: UploadPayload): SoFetchPromise<T>;

    delete<T>(url: string, body?: UploadPayload): SoFetchPromise<T>;

    <T>(url: string, body?: UploadPayload): SoFetchPromise<T>;

    instance(): SoFetchLike<TResponse>;
}
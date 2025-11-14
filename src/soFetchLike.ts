import {SoFetchConfig} from "./soFetchConfig.ts";
import {SoFetchPromise} from "./soFetchPromise.ts";
import {UploadPayload} from "./uploadPayload.ts";

import {RequestMethod} from "./requestMethod.ts";

export interface SoFetchLike<TResponse = unknown> {
    verbose: boolean;
    config: SoFetchConfig;

    get<T>(url: string, body?: UploadPayload): SoFetchPromise<T>;

    post<T>(url: string, body?: UploadPayload): SoFetchPromise<T>;

    put<T>(url: string, body?: UploadPayload): SoFetchPromise<T>;

    patch<T>(url: string, body?: UploadPayload): SoFetchPromise<T>;

    delete<T>(url: string, body?: UploadPayload): SoFetchPromise<T>;
    
    request<T>(method:RequestMethod, url: string, body?: UploadPayload): SoFetchPromise<T>

    <T>(url: string, body?: UploadPayload): SoFetchPromise<T>;

    instance(configOrAuthKey?:SoFetchConfig | string): SoFetchLike<TResponse>;
}
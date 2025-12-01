import {SoFetchConfig} from "./soFetchConfig.ts";
import {SoFetchPromise} from "./soFetchPromise.ts";
import {UploadPayload} from "./uploadPayload.ts";

import {RequestMethod} from "./requestMethod.ts";

export interface SoFetchLike<TResponse = unknown> {
    verbose: boolean;
    config: SoFetchConfig;

    get<T>(url: string, body?: UploadPayload): SoFetchPromise<T | undefined>;

    post<T>(url: string, body?: UploadPayload): SoFetchPromise<T | undefined>;

    put<T>(url: string, body?: UploadPayload): SoFetchPromise<T | undefined>;

    patch<T>(url: string, body?: UploadPayload): SoFetchPromise<T | undefined>;

    delete<T>(url: string, body?: UploadPayload): SoFetchPromise<T | undefined>;
    
    request<T>(method:RequestMethod, url: string, body?: UploadPayload): SoFetchPromise<T | undefined>

    <T>(url: string, body?: UploadPayload): SoFetchPromise<T | undefined>;

    instance(configOrAuthKey?:SoFetchConfig | string): SoFetchLike<TResponse>;
}
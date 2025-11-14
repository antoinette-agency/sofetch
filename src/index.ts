import soFetch, { SoFetchRequest } from "./soFetch.ts";
import {SoFetchPromise} from "./soFetchPromise.ts";
import {SoFetchConfig} from "./soFetchConfig.ts";
import {SoFetchLike} from "./soFetchLike.ts";
import { UploadPayload } from "./uploadPayload.ts";
import { ErrorHandlerDict } from "./errorHandlerDict.ts";
import { FileWithFieldName } from "./fileWithFieldName.ts";
import { AuthenticationType } from "./authenticationType.ts";
import { AuthTokenStorageType } from "./authTokenStorageType.ts";
import { HttpStatus } from "./httpStatus.ts";
import { Browser } from "./browser.ts";
import { OS } from "./OS.ts";

export default soFetch

export {SoFetchPromise, SoFetchConfig, HttpStatus}

class RequestMethod {
}

export type {
    AuthenticationType,
    AuthTokenStorageType,
    Browser,
    ErrorHandlerDict,
    FileWithFieldName,
    OS,
    RequestMethod,
    SoFetchLike, 
    SoFetchRequest, 
    UploadPayload
}

// Expose to window in browser builds
if (typeof window !== 'undefined') {
    (window as any).soFetch = soFetch;
}
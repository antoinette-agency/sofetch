import soFetch, { SoFetchRequest } from "./soFetch.ts";
import {SoFetchPromise} from "./soFetchPromise.ts";
import {SoFetchConfig} from "./soFetchConfig.ts";
import {SoFetchLike} from "./soFetchLike.ts";
import { UploadPayload } from "./uploadPayload.ts";
import { ErrorHandlerDict } from "./errorHandlerDict.ts";
import { FileWithFieldName } from "./fileWithFieldName.ts";

export default soFetch

export {SoFetchPromise, SoFetchConfig}

export type {SoFetchLike, SoFetchRequest, UploadPayload, ErrorHandlerDict, FileWithFieldName}
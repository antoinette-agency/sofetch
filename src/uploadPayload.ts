import {FileWithFieldName} from "./fileWithFieldName.ts";

/**
 * The payload supplied to a soFetch request. This can be undefined, or a plain serialisable object
 * (for JSON requests) of a file, or array of files, or a FileWithFieldName or array of type FileWithFieldName
 * (if your endpoint requires the files to have specified field names)
 */
export type UploadPayload = object | File | File[] | FileWithFieldName | FileWithFieldName[] | undefined
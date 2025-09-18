import {UploadPayload} from "./uploadPayload.ts";
import {FileWithFieldName} from "./fileWithFieldName.ts";

export const normalisePayload = (payload:UploadPayload):{files?:FileWithFieldName[], jsonPayload?:object} => {
    const {isDefined, isArray, isFiles} = getPayloadType(payload)
    if (!isDefined) {
        return {}
    }
    if (!isFiles) {
        return {jsonPayload:payload}
    }
    const fileArray = (isArray ? payload : [payload]) as (File[] | FileWithFieldName[])
    const files = (isFileWithFieldName(fileArray[0]) ? fileArray : fileArray.map(((x,i) => ({file:x, fieldName:`file${i}`})))) as FileWithFieldName[]
    return {files}
}

export const isFileWithFieldName = (v:object) => {
    return 'file' in v && v.file instanceof File
}

export const getPayloadType = (payload: UploadPayload): { isDefined: boolean, isArray: boolean, isFiles: boolean } => {
    if (!payload) {
        return {isDefined: false, isArray: false, isFiles: false}
    }
    if (Array.isArray(payload)) {
        if (!payload.length) {
            //For the purposes of the HTTP request a payload which is an empty array is undefined
            //We won't be sending a body with the request.
            return {isDefined: false, isArray: true, isFiles: false}
        }
        if (payload[0] instanceof File) {
            return {isDefined: true, isArray: true, isFiles: true}
        }
        if (isFileWithFieldName(payload[0])) {
            return {isDefined: true, isArray: true, isFiles: true}
        }
        return {isDefined: true, isArray: true, isFiles: false}
    }
    if (payload instanceof File) {
        return {isDefined: true, isArray: false, isFiles: true}
    }
    if (isFileWithFieldName(payload)) {
        return {isDefined: true, isArray: false, isFiles: true}
    }
    return {isDefined: true, isArray: false, isFiles: false}
}
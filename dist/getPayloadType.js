"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayloadType = exports.isFileWithFieldName = exports.normalisePayload = void 0;
const normalisePayload = (payload) => {
    const { isDefined, isArray, isFiles } = (0, exports.getPayloadType)(payload);
    if (!isDefined) {
        return {};
    }
    if (!isFiles) {
        return { jsonPayload: payload };
    }
    const fileArray = (isArray ? payload : [payload]);
    const files = ((0, exports.isFileWithFieldName)(fileArray[0]) ? fileArray : fileArray.map(((x, i) => ({ file: x, fieldName: `file${i}` }))));
    return { files };
};
exports.normalisePayload = normalisePayload;
const isFileWithFieldName = (v) => {
    return 'file' in v && v.file instanceof File;
};
exports.isFileWithFieldName = isFileWithFieldName;
const getPayloadType = (payload) => {
    if (!payload) {
        return { isDefined: false, isArray: false, isFiles: false };
    }
    if (Array.isArray(payload)) {
        if (!payload.length) {
            //For the purposes of the HTTP request a payload which is an empty array is undefined
            //We won't be sending a body with the request.
            return { isDefined: false, isArray: true, isFiles: false };
        }
        if (payload[0] instanceof File) {
            return { isDefined: true, isArray: true, isFiles: true };
        }
        if ((0, exports.isFileWithFieldName)(payload[0])) {
            return { isDefined: true, isArray: true, isFiles: true };
        }
        return { isDefined: true, isArray: true, isFiles: false };
    }
    if (payload instanceof File) {
        return { isDefined: true, isArray: false, isFiles: true };
    }
    if ((0, exports.isFileWithFieldName)(payload)) {
        return { isDefined: true, isArray: false, isFiles: true };
    }
    return { isDefined: true, isArray: false, isFiles: false };
};
exports.getPayloadType = getPayloadType;

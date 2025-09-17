"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const soFetchConfig_1 = require("./soFetchConfig");
const soFetchPromise_1 = require("./soFetchPromise");
const sleep_1 = require("./sleep");
const getPayloadType_1 = require("./getPayloadType");
const makeRequestWrapper = (method, url, body, files) => {
    const promise = new soFetchPromise_1.SoFetchPromise((resolve, reject) => {
        (async () => {
            const headers = {};
            let request = { url, method, body, headers };
            request.url = !soFetch.config.baseUrl || request.url.startsWith("http") ? request.url : `${soFetch.config.baseUrl}${request.url}`;
            await (0, sleep_1.sleep)(0); //Allows the promise to be initialised
            request = promise.transformRequest(request);
            request = soFetch.config.transformRequest(request);
            const { files, jsonPayload } = (0, getPayloadType_1.normalisePayload)(request.body);
            let init = files ? makeFilesRequest(request, files) : makeJsonRequest(request);
            init = promise.transformInit(init);
            const response = await Promise.race([
                fetch(request.url, init),
                new Promise((_, reject) => setTimeout(() => reject(new Error("SoFetch timed out")), promise.timeout))
            ]);
            promise.dispatchEvent(new CustomEvent("onRequestSuccess", { detail: response }));
            if (!response.ok) {
                const requestHandled = promise.handleHttpError(response);
                const configHandled = soFetch.config.handleHttpError(response);
                if (!requestHandled && !configHandled) {
                    throw new Error(`Received response ${response.status} from URL ${response.url}`, { cause: response });
                }
            }
            const returnObject = await handleResponse(response);
            resolve(returnObject);
        })().catch(e => {
            reject(e);
        });
    });
    return promise;
};
const makeJsonRequest = (request) => {
    const { url, method, body } = request;
    request.headers['content-type'] = 'application/json';
    const init = {
        body: body ? JSON.stringify(body) : undefined,
        headers: request.headers,
        method,
        credentials: "include"
    };
    return init;
};
const makeFilesRequest = (request, files) => {
    const { method, headers } = request;
    const formData = new FormData();
    files.forEach(f => {
        formData.append(f.fieldName, f.file, f.file.name);
    });
    const init = {
        body: formData,
        headers,
        method,
        credentials: "include"
    };
    return init;
};
const handleResponse = async (response) => {
    if (response.status === 203) {
        return undefined;
    }
    const responseBody = await response.text();
    if (!responseBody) {
        return undefined;
    }
    let responseObject = responseBody;
    try {
        responseObject = JSON.parse(responseBody);
    }
    catch {
    }
    return responseObject;
};
const soFetch = ((url, body, files) => {
    return makeRequestWrapper(body ? "POST" : "GET", url, body);
});
soFetch.verbose = false;
soFetch.config = soFetch.config || new soFetchConfig_1.SoFetchConfig();
soFetch.get = (url, body) => {
    return makeRequestWrapper("GET", url, body);
};
soFetch.post = (url, body) => {
    return makeRequestWrapper("POST", url, body);
};
soFetch.put = (url, body) => {
    return makeRequestWrapper("PUT", url, body);
};
soFetch.patch = (url, body) => {
    return makeRequestWrapper("PATCH", url, body);
};
soFetch.delete = (url, body) => {
    return makeRequestWrapper("DELETE", url, body);
};
exports.default = soFetch;

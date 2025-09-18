"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);

// src/soFetchConfig.ts
var SoFetchConfig = class {
  errorHandlers = {};
  beforeSendHandlers = [];
  constructor() {
  }
  baseUrl = "";
  addHTTPHandler(status, handler) {
    if (!this.errorHandlers[status]) {
      this.errorHandlers[status] = [];
    }
    this.errorHandlers[status].push(handler);
  }
  handleHttpError(response) {
    const status = response.status;
    const handled = this.errorHandlers[status] && this.errorHandlers[status].length;
    if (handled) {
      this.errorHandlers[status].forEach((h) => h(response));
    }
    return handled;
  }
  setBasicAuthentication({ username, password }) {
    const token = btoa(`${username}:${password}`);
    const headerValue = `Basic ${token}`;
    this.beforeSend((request) => {
      request.headers["Authorization"] = headerValue;
    });
  }
  setBearerToken(token) {
    this.beforeSend((request) => {
      request.headers["Authorization"] = `Bearer ${token}`;
    });
  }
  setHeaderApiKey({ headerName, value }) {
    this.beforeSend((request) => {
      request.headers[headerName] = value;
    });
  }
  setQueryStringApiKey({ paramName, value }) {
    this.beforeSend((request) => {
      const url = new URL(request.url);
      url.searchParams.append(paramName, value);
      request.url = url.toString();
    });
  }
  beforeSend(handler) {
    this.beforeSendHandlers.push(handler);
  }
  transformRequest(request) {
    this.beforeSendHandlers.forEach((h) => {
      request = h(request) || request;
    });
    return request;
  }
};

// src/soFetchPromise.ts
var SoFetchPromise = class extends EventTarget {
  inner;
  errorHandlers = {};
  beforeSendHandlers = [];
  beforeFetchSendHandlers = [];
  timeout = 3e4;
  then;
  catch;
  finally;
  constructor(executor) {
    super();
    this.inner = new Promise(executor);
    this.then = this.inner.then.bind(this.inner);
    this.catch = this.inner.catch.bind(this.inner);
    this.finally = this.inner.finally.bind(this.inner);
  }
  onRequestComplete(handler) {
    this.addEventListener("onRequestSuccess", (e) => {
      const event = e;
      handler(event.detail);
    });
    return this;
  }
  beforeSend(handler) {
    this.beforeSendHandlers.push(handler);
    return this;
  }
  beforeFetchSend(handler) {
    this.beforeFetchSendHandlers.push(handler);
    return this;
  }
  catchHTTP(status, handler) {
    if (!this.errorHandlers[status]) {
      this.errorHandlers[status] = [];
    }
    this.errorHandlers[status].push(handler);
    return this;
  }
  handleHttpError(response) {
    const status = response.status;
    const handled = this.errorHandlers[status] && this.errorHandlers[status].length;
    if (handled) {
      this.errorHandlers[status].forEach((h) => h(response));
    }
    return handled;
  }
  transformRequest(request) {
    this.beforeSendHandlers.forEach((h) => {
      request = h(request) || request;
    });
    return request;
  }
  transformInit(init) {
    this.beforeFetchSendHandlers.forEach((h) => {
      init = h(init) || init;
    });
    return init;
  }
  async setTimeout(ms) {
    this.timeout = ms;
    return this;
  }
};

// src/sleep.ts
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// src/getPayloadType.ts
var normalisePayload = (payload) => {
  const { isDefined, isArray, isFiles } = getPayloadType(payload);
  if (!isDefined) {
    return {};
  }
  if (!isFiles) {
    return { jsonPayload: payload };
  }
  const fileArray = isArray ? payload : [payload];
  const files = isFileWithFieldName(fileArray[0]) ? fileArray : fileArray.map(((x, i) => ({ file: x, fieldName: `file${i}` })));
  return { files };
};
var isFileWithFieldName = (v) => {
  return "file" in v && v.file instanceof File;
};
var getPayloadType = (payload) => {
  if (!payload) {
    return { isDefined: false, isArray: false, isFiles: false };
  }
  if (Array.isArray(payload)) {
    if (!payload.length) {
      return { isDefined: false, isArray: true, isFiles: false };
    }
    if (payload[0] instanceof File) {
      return { isDefined: true, isArray: true, isFiles: true };
    }
    if (isFileWithFieldName(payload[0])) {
      return { isDefined: true, isArray: true, isFiles: true };
    }
    return { isDefined: true, isArray: true, isFiles: false };
  }
  if (payload instanceof File) {
    return { isDefined: true, isArray: false, isFiles: true };
  }
  if (isFileWithFieldName(payload)) {
    return { isDefined: true, isArray: false, isFiles: true };
  }
  return { isDefined: true, isArray: false, isFiles: false };
};

// src/soFetch.ts
var makeRequestWrapper = (method, url, body, files) => {
  const promise = new SoFetchPromise((resolve, reject) => {
    (async () => {
      const headers = {};
      let request = { url, method, body, headers };
      request.url = !soFetch.config.baseUrl || request.url.startsWith("http") ? request.url : `${soFetch.config.baseUrl}${request.url}`;
      await sleep(0);
      request = promise.transformRequest(request);
      request = soFetch.config.transformRequest(request);
      const { files: files2, jsonPayload } = normalisePayload(request.body);
      let init = files2 ? makeFilesRequest(request, files2) : makeJsonRequest(request);
      init = promise.transformInit(init);
      const response = await Promise.race([
        fetch(request.url, init),
        new Promise(
          (_, reject2) => setTimeout(() => reject2(new Error("SoFetch timed out")), promise.timeout)
        )
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
    })().catch((e) => {
      reject(e);
    });
  });
  return promise;
};
var makeJsonRequest = (request) => {
  const { url, method, body } = request;
  request.headers["content-type"] = "application/json";
  const init = {
    body: body ? JSON.stringify(body) : void 0,
    headers: request.headers,
    method,
    credentials: "include"
  };
  return init;
};
var makeFilesRequest = (request, files) => {
  const { method, headers } = request;
  const formData = new FormData();
  files.forEach((f) => {
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
var handleResponse = async (response) => {
  if (response.status === 203) {
    return void 0;
  }
  const responseBody = await response.text();
  if (!responseBody) {
    return void 0;
  }
  let responseObject = responseBody;
  try {
    responseObject = JSON.parse(responseBody);
  } catch {
  }
  return responseObject;
};
var soFetch = ((url, body, files) => {
  return makeRequestWrapper(body ? "POST" : "GET", url, body);
});
soFetch.verbose = false;
soFetch.config = soFetch.config || new SoFetchConfig();
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
var soFetch_default = soFetch;

// src/index.ts
var index_default = soFetch_default;

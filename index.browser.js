// src/cookieTypescriptUtils.ts
function getCookie(name) {
  if (typeof document === "undefined") {
    return;
  }
  const value = document.cookie;
  const cookies = value.split("; ");
  const cookieEntries = cookies.map((c) => {
    const parts = c.split("=");
    return {
      key: parts[0],
      value: parts[1]
    };
  });
  const cookie = cookieEntries.find((x) => x.key === name);
  return cookie == null ? void 0 : cookie.value;
}

// src/soFetchConfig.ts
var SoFetchConfig = class {
  constructor() {
    this.errorHandlers = {};
    this.beforeSendHandlers = [];
    this.beforeFetchSendHandlers = [];
    this.onRequestCompleteHandlers = [];
    /**
     * Specifies how (or if) soFetch should persist and authentication
     */
    this.authTokenStorage = null;
    this.inMemoryAuthToken = "";
    /**
     * Specifies how soFetch should send authentication credentials to the server
     */
    this.authenticationType = null;
    this.getAuthToken = async () => {
      switch (this.authTokenStorage) {
        case null:
          return "";
        case "memory":
          return this.inMemoryAuthToken;
        case "localStorage":
          return (localStorage == null ? void 0 : localStorage.getItem(this.authenticationKey)) || "";
        case "sessionStorage":
          return (sessionStorage == null ? void 0 : sessionStorage.getItem(this.authenticationKey)) || "";
        case "cookie":
          return getCookie(this.authenticationKey) || "";
        default:
          return this.authTokenStorage();
      }
    };
    /**
     * Use this method to set an auth token after it's been received from a server, typically as 
     * the response to a login request
     * @param authToken
     */
    this.setAuthToken = (authToken) => {
      switch (this.authTokenStorage) {
        case "memory":
          this.inMemoryAuthToken = authToken;
          break;
        case "localStorage":
          localStorage.setItem(this.authenticationKey, authToken);
          break;
        case "sessionStorage":
          sessionStorage.setItem(this.authenticationKey, authToken);
          break;
        case "cookie":
          document.cookie = `${this.authenticationKey}=${authToken};`;
          break;
        /*If we're here then authTokenStorage is either null or a custom function so
            there's nothing to do*/
        default:
          break;
      }
    };
    /**
     * The base URL for all HTTP requests in the instance. If absent this is assumed to be the current base url.
     * If running in Node relative requests without a baseUrl will throw an error.
     */
    this.baseUrl = "";
    /**
     * The key which is used if an authentication token is persisted via cookies, localStorage or sessionStorage
     */
    this.authenticationKey = "SOFETCH_AUTHENTICATION";
    /**
     * The key which is used if an authentication token is sent to the server via a custom header
     */
    this.authHeaderKey = "";
    /**
     * The key which is used if an authentication token is sent to the server via the query string
     */
    this.authQueryStringKey = "";
    this.setAuthTokenStorage = (authTokenStorage) => {
      if (authTokenStorage) {
        this.authTokenStorage = authTokenStorage;
        return;
      }
      this.authTokenStorage = typeof document === "undefined" ? "memory" : "localStorage";
    };
  }
  /**
   * Adds a handler which will be executed on receipt from the server of the specified status code.
   * Multiple handlers will be executed in the order in which they are added. If a request has it's
   * own handler(s) for a given status code the corresponding handlers in the config will not be executed.
   * @param status An HTTP status code
   * @param handler A function which accepts a Fetch Response as an argument
   * @example
   *
   *    soFetchConfig.catchHttp(404, (res:Response) => {
   *         alert("This object can't be found")
   *     })
   *
   * @see For more examples see https://sofetch.antoinette.agency
   */
  catchHTTP(status, handler) {
    if (!this.errorHandlers[status]) {
      this.errorHandlers[status] = [];
    }
    this.errorHandlers[status].push(handler);
  }
  /**
   * Adds a handler which will be executed before every request. beforeSend handlers on the config
   * will be executed before request-specific handlers
   * @param handler
   * @example
   * 
   *    soFetch.config.beforeSend((req:SoFetchRequest) => {
   *       console.info(`Sending ${req.method} request to URL ${req.url}`
   *    })
   *    
   * @see For more examples see https://sofetch.antoinette.agency
   */
  beforeSend(handler) {
    this.beforeSendHandlers.push(handler);
  }
  /**
   * Adds a handler which will be executed before every request. beforeSend handlers on the config
   * will be executed before request-specific handlers
   * @param handler
   * @example
   *
   *    soFetch.config.beforeSend((req:SoFetchRequest) => {
   *       console.info(`Sending ${req.method} request to URL ${req.url}`
   *    })
   *
   * @see For more examples see https://sofetch.antoinette.agency
   */
  beforeFetchSend(handler) {
    this.beforeFetchSendHandlers.push(handler);
  }
  /**
   * Adds a handler which will be executed after every request. Handlers will fire regardless of whether
   * the response status code indicated an error
   * @param handler
   * @example
   *
   *    soFetch.config.onRequestComplete((r: Response) => {
   *       console.info(`Response received from ${r.url} with status ${r.status}`
   *    })
   *
   * @see For more examples see https://sofetch.antoinette.agency
   */
  onRequestComplete(handler) {
    this.onRequestCompleteHandlers.push(handler);
  }
  /**
   * Tells soFetch to use [bearer authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication#bearer) to send an authentication token to the server
   * @param authToken - optional. Use this if you have already obtained a token from a login process. Typically this would be left undefined for bearer authentication as the token is usually obtained from a login process.
   * @param authenticationKey - optional. Specify an authentication key if you don't want to use the default: 'SOFETCH_AUTHENTICATION'
   * @param authTokenStorage - optional, defaults to 'localStorage' on the browser and 'memory' in Node
   */
  useBearerAuthentication({ authToken, authenticationKey, authTokenStorage }) {
    this.authenticationType = "bearer";
    if (authenticationKey) {
      this.authenticationKey = authenticationKey;
    }
    this.setAuthTokenStorage(authTokenStorage);
    if (authToken) {
      this.setAuthToken(authToken);
    }
  }
  /**
   * Tells soFetch to authenticate using cookies.
   * @param authToken - optional. Use this if you have already obtained a token. Typically this would be left undefined for bearer authentication as the token is usually obtained from a login process.
   * @param authenticationKey - optional. Specify an authentication key if you don't want to use the default: 'SOFETCH_AUTHENTICATION'
   */
  useCookieAuthentication(props) {
    this.authenticationType = "cookies";
    let authenticationKey, authToken;
    if (props) {
      authenticationKey = props.authenticationKey;
      authToken = props.authToken;
    }
    if (authenticationKey) {
      this.authenticationKey = authenticationKey;
    }
    this.authTokenStorage = typeof document === "undefined" ? "memory" : "cookie";
    if (authToken) {
      this.setAuthToken(authToken);
    }
  }
  /**
   * Tells soFetch to send an authentication token to the server 
   * @param headerKey - required. The key of the header with which to send the authentication token
   * @param authToken - optional. Use this if you have already obtained a token.
   * @param authenticationKey - optional. Specify an authentication key if you don't want to use the default: 'SOFETCH_AUTHENTICATION'
   * @param authTokenStorage - optional, defaults to 'localStorage' on the browser and 'memory' in Node
   */
  useHeaderAuthentication({ headerKey, authToken, authenticationKey, authTokenStorage }) {
    this.authenticationType = "header";
    this.authHeaderKey = headerKey;
    if (authenticationKey) {
      this.authenticationKey = authenticationKey;
    }
    this.setAuthTokenStorage(authTokenStorage);
    if (authToken) {
      this.setAuthToken(authToken);
    }
  }
  /**
   * Tells soFetch to send append an authentication token to the request query string
   * @param queryStringKey - required. The key of the query string item with which to send the authentication token
   * @param authToken - optional. Use this if you have already obtained a token.
   * @param authenticationKey - optional. Specify an authentication key if you don't want to use the default: 'SOFETCH_AUTHENTICATION'
   * @param authTokenStorage - optional. Defaults to 'localStorage' on the browser and 'memory' in Node
   */
  useQueryStringAuthentication({ queryStringKey, authToken, authenticationKey, authTokenStorage }) {
    this.authenticationType = "queryString";
    this.authQueryStringKey = queryStringKey;
    if (authenticationKey) {
      this.authenticationKey = authenticationKey;
    }
    this.setAuthTokenStorage(authTokenStorage);
    if (authToken) {
      this.setAuthToken(authToken);
    }
  }
  /**
   * Tells soFetch to use [basic authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Authentication#basic) when communicating with the server
   * @param username - optional but required is password is used. Use this if you've already obtained a username and password.
   * @param password - optional but required is username is used. Use this if you've already obtained a username and password.
   * @param authenticationKey - optional. Specify an authentication key if you don't want to use the default: 'SOFETCH_AUTHENTICATION'
   * @param authTokenStorage - optional, defaults to 'localStorage' on the browser and 'memory' in Node
   */
  useBasicAuthentication({ username, password, authenticationKey, authTokenStorage }) {
    this.authenticationType = "basic";
    if (username && !password || password && !username) {
      console.warn("Was expecting both username and password to be set for soFetch.config.useBasicAuthentication. Continuing but authentication may not behave as expected");
    }
    if (authenticationKey) {
      this.authenticationKey = authenticationKey;
    }
    this.setAuthTokenStorage(authTokenStorage);
    if (username && password) {
      this.setBasicAuthCredentials({ username, password });
    }
  }
  setBasicAuthCredentials({ username, password }) {
    const token = btoa(`${username}:${password}`);
    this.setAuthToken(token);
  }
};

// src/soFetchPromise.ts
var SoFetchPromise = class {
  constructor(executor) {
    this.errorHandlers = {};
    this.beforeSendHandlers = [];
    this.beforeFetchSendHandlers = [];
    this.onRequestCompleteHandlers = [];
    this.timeout = 3e4;
    this.inner = new Promise(executor);
    this.then = this.inner.then.bind(this.inner);
    this.catch = this.inner.catch.bind(this.inner);
    this.finally = this.inner.finally.bind(this.inner);
  }
  /**
   * Adds a handler which will be executed after this HTTP request is completed. Handlers will fire regardless of whether
   * the response status code indicated an error
   * @param handler
   * @example
   *
   *    await soFetch("https://example.com/users",{name:"Sarah", id:1234}).onRequestComplete((r: Response) => {
   *       console.info(`Response received from ${r.url} with status ${r.status}`
   *    })
   *
   * @see For more examples see https://sofetch.antoinette.agency
   */
  onRequestComplete(handler) {
    this.onRequestCompleteHandlers.push(handler);
    return this;
  }
  /**
   * Adds a handler which will be executed before this HTTP request is sent. BeforeSend handlers added here will
   * will be executed after those added on the config.
   * @param handler
   * @example
   *
   *    await soFetch("https://example.com/users",{name:"Sarah", id:1234}).beforeSend((req:SoFetchRequest) => {
   *       console.info(`Sending ${req.method} request to URL ${req.url}`
   *    })
   *
   * @see For more examples see https://sofetch.antoinette.agency
   */
  beforeSend(handler) {
    this.beforeSendHandlers.push(handler);
    return this;
  }
  /**
   * Adds a handler which allows developers to modify the low-level fetch RequestInit object before the HTTP
   * request is made. These handlers execute after beforeSend handlers. This is useful for one-off
   * occasions when you need to access some aspect of the low-level Fetch API. If you're using this a lot
   * it might make more sense for you to use the Fetch API directly.
   * @param handler
   * @example
   *
   *    //An example of how you might send both files and data in a single request.
   *    const postFilesAndDataResponse = await soFetch.put<PostFilesAndDataResponse>("https://example.com/files-and-data").beforeFetchSend((init:RequestInit) => {
   *       const formData = new FormData()
   *       formData.append("company", "Antoinette");
   *       formData.append("file1", myFile)
   *       const headers = {...init.headers} as Record<string,string>
   *       if (headers["content-type"]) {
   *           delete headers["content-type"]
   *       }
   *       init.body = formData
   *       init.headers = headers
   *       return init
   *    })
   *
   * @see For more examples see https://sofetch.antoinette.agency
   */
  beforeFetchSend(handler) {
    this.beforeFetchSendHandlers.push(handler);
    return this;
  }
  /**
   * Adds a handler which will be executed on receipt from the server of the specified status code.
   * Multiple handlers will be executed in the order in which they are added. If you add an error handler
   * for a specific status code here any corresponding handlers in the config will not be executed.
   * @param status An HTTP status code
   * @param handler A function which accepts a Fetch Response as an argument
   * @example
   *
   *    const unicorn = await soFetch("https://unicorns.com/1234")
   *      .catchHttp(404, (res:Response) => {
   *         console.error("This unicorn can't be found")
   *     })
   *
   * @see For more examples see https://sofetch.antoinette.agency
   */
  catchHTTP(status, handler) {
    if (!this.errorHandlers[status]) {
      this.errorHandlers[status] = [];
    }
    this.errorHandlers[status].push(handler);
    return this;
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

// src/handleHttpErrors.ts
var handleHttpErrors = (response, errorHandlers) => {
  const status = response.status;
  const handled = !!(errorHandlers[status] && errorHandlers[status].length);
  if (handled) {
    errorHandlers[status].forEach((h) => h(response));
  }
  return handled;
};

// src/transformRequest.ts
var transformRequest = async (request, beforeSendHandlers) => {
  for (const h of beforeSendHandlers) {
    request = await h(request) || request;
  }
  return request;
};

// src/handleBeforeFetchSend.ts
var handleBeforeFetchSend = async (init, handlers) => {
  for (const h of handlers) {
    init = await h(init) || init;
  }
  return init;
};

// src/soFetch.ts
async function addAuthentication(request, config) {
  const token = config.authenticationType === null ? "" : await config["getAuthToken"]();
  if (!token) {
    return request;
  }
  switch (config.authenticationType) {
    case null:
      return request;
    case "basic":
      request.headers["Authorization"] = `Basic ${token}`;
      return request;
    case "bearer":
      request.headers["Authorization"] = `Bearer ${token}`;
      return request;
    case "header":
      request.headers[config.authHeaderKey] = token;
      return request;
    case "queryString":
      const url = new URL(request.url);
      url.searchParams.append(config.authQueryStringKey, token);
      request.url = url.toString();
      return request;
    case "cookies":
      if (typeof document === "undefined") {
        request.headers["Cookie"] = `${config.authenticationKey}=${token}`;
      }
      return request;
  }
}
var convertArgsToFetchInit = async ({ url, method, body, config, promise }) => {
  const headers = {};
  let request = { url, method, body, headers };
  request.url = !config.baseUrl || request.url.startsWith("http") ? request.url : `${config.baseUrl}${request.url}`;
  request = await addAuthentication(request, config);
  request = await transformRequest(request, promise.beforeSendHandlers);
  request = await transformRequest(request, config["beforeSendHandlers"]);
  const { files } = normalisePayload(request.body);
  const sendCookies = config.authenticationType === "cookies";
  let init = files ? makeFilesRequest(request, files, sendCookies) : makeJsonRequest(request, sendCookies);
  init = await handleBeforeFetchSend(init, promise.beforeFetchSendHandlers);
  init = await handleBeforeFetchSend(init, config["beforeFetchSendHandlers"]);
  return { init, finalUrl: request.url };
};
var makeRequestWrapper = (config, method, url, body) => {
  const promise = new SoFetchPromise((resolve, reject) => {
    (async () => {
      await sleep(0);
      const { finalUrl, init } = await convertArgsToFetchInit({ url, method, body, config, promise });
      const startTime = (/* @__PURE__ */ new Date()).getTime();
      const response = await Promise.race([
        fetch(finalUrl, init),
        new Promise(
          (_, reject2) => setTimeout(() => reject2(new Error("SoFetch timed out")), promise.timeout)
        )
      ]);
      const duration = (/* @__PURE__ */ new Date()).getTime() - startTime;
      if (soFetch.verbose) {
        console.info(`SoFetch: ${method} ${response.status} ${finalUrl}`);
      }
      for (const h of promise["onRequestCompleteHandlers"]) {
        await h(response, { duration, method: init.method || "" });
      }
      for (const h of config["onRequestCompleteHandlers"]) {
        await h(response, { duration, method: init.method || "" });
      }
      if (!response.ok) {
        const requestHandled = handleHttpErrors(response, promise.errorHandlers);
        let configHandled = false;
        if (!requestHandled) {
          configHandled = handleHttpErrors(response, config["errorHandlers"]);
        }
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
var makeJsonRequest = (request, sendCookies) => {
  const { method, body } = request;
  if (body) {
    request.headers["Content-Type"] = "application/json";
  }
  const init = {
    body: body ? JSON.stringify(body) : void 0,
    headers: request.headers,
    method,
    credentials: sendCookies ? "include" : void 0
  };
  return init;
};
var makeFilesRequest = (request, files, sendCookies) => {
  const { method, headers } = request;
  const formData = new FormData();
  files.forEach((f) => {
    formData.append(f.fieldName, f.file, f.file.name);
  });
  const init = {
    body: formData,
    headers,
    method,
    credentials: sendCookies ? "include" : void 0
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
  } catch (e) {
  }
  return responseObject;
};
var soFetch = ((url, body) => {
  return makeRequestWrapper(soFetch.config || new SoFetchConfig(), body ? "POST" : "GET", url, body);
});
soFetch.verbose = false;
soFetch.config = new SoFetchConfig();
soFetch.get = (url) => {
  return makeRequestWrapper(soFetch.config, "GET", url);
};
soFetch.post = (url, body) => {
  return makeRequestWrapper(soFetch.config, "POST", url, body);
};
soFetch.put = (url, body) => {
  return makeRequestWrapper(soFetch.config, "PUT", url, body);
};
soFetch.patch = (url, body) => {
  return makeRequestWrapper(soFetch.config, "PATCH", url, body);
};
soFetch.delete = (url) => {
  return makeRequestWrapper(soFetch.config, "DELETE", url);
};
function generateNewAuthenticationKey(authenticationKey) {
  const regex = /^(.*?)([0-9]+)?$/;
  const match = authenticationKey.match(regex);
  const match1 = match ? match[1] : null;
  const match2 = match ? match[2] : null;
  if (!match1) {
    return authenticationKey;
  }
  let next = match2 ? parseInt(match2) + 1 : 1;
  return `${match1}${next}`;
}
soFetch.instance = (config) => {
  const configWasPassed = !!config;
  const newConfig = new SoFetchConfig();
  const oldConfig = config || soFetch.config;
  if (!configWasPassed) {
    newConfig.baseUrl = oldConfig.baseUrl;
    newConfig["beforeSendHandlers"] = [...oldConfig["beforeSendHandlers"]];
    newConfig["beforeFetchSendHandlers"] = [...oldConfig["beforeFetchSendHandlers"]];
    newConfig["onRequestCompleteHandlers"] = [...oldConfig["onRequestCompleteHandlers"]];
    newConfig.authTokenStorage = oldConfig.authTokenStorage;
    newConfig["inMemoryAuthToken"] = oldConfig["inMemoryAuthToken"];
  }
  newConfig.authenticationKey = generateNewAuthenticationKey(oldConfig.authenticationKey);
  const soFetchInstance = ((url, body) => {
    return makeRequestWrapper(newConfig, body ? "POST" : "GET", url, body);
  });
  soFetchInstance.get = (url, body) => {
    return makeRequestWrapper(newConfig, "GET", url, body);
  };
  soFetchInstance.post = (url, body) => {
    return makeRequestWrapper(newConfig, "POST", url, body);
  };
  soFetchInstance.put = (url, body) => {
    return makeRequestWrapper(newConfig, "PUT", url, body);
  };
  soFetchInstance.patch = (url, body) => {
    return makeRequestWrapper(newConfig, "PATCH", url, body);
  };
  soFetchInstance.delete = (url, body) => {
    return makeRequestWrapper(newConfig, "DELETE", url, body);
  };
  soFetchInstance.verbose = soFetch.verbose;
  soFetchInstance.config = newConfig;
  soFetchInstance.instance = (c) => {
    return soFetch.instance(c || newConfig);
  };
  return soFetchInstance;
};
var soFetch_default = soFetch;

// src/index.ts
var index_default = soFetch_default;
if (typeof window !== "undefined") {
  window.soFetch = soFetch_default;
}
export {
  SoFetchConfig,
  SoFetchPromise,
  index_default as default
};
//# sourceMappingURL=index.browser.js.map

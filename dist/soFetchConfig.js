"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoFetchConfig = void 0;
class SoFetchConfig {
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
            this.errorHandlers[status].forEach(h => h(response));
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
        this.beforeSendHandlers.forEach(h => {
            request = h(request) || request;
        });
        return request;
    }
}
exports.SoFetchConfig = SoFetchConfig;

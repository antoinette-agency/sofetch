"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoFetchPromise = void 0;
class SoFetchPromise extends EventTarget {
    inner;
    errorHandlers = {};
    beforeSendHandlers = [];
    beforeFetchSendHandlers = [];
    timeout = 30000;
    then;
    catch;
    finally;
    constructor(executor) {
        super();
        this.inner = new Promise(executor);
        // Bind promise methods once inner exists
        this.then = this.inner.then.bind(this.inner);
        this.catch = this.inner.catch.bind(this.inner);
        this.finally = this.inner.finally.bind(this.inner);
    }
    onRequestComplete(handler) {
        this.addEventListener("onRequestSuccess", e => {
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
            this.errorHandlers[status].forEach(h => h(response));
        }
        return handled;
    }
    transformRequest(request) {
        this.beforeSendHandlers.forEach(h => {
            request = h(request) || request;
        });
        return request;
    }
    transformInit(init) {
        this.beforeFetchSendHandlers.forEach(h => {
            init = h(init) || init;
        });
        return init;
    }
    async setTimeout(ms) {
        this.timeout = ms;
        return this;
    }
}
exports.SoFetchPromise = SoFetchPromise;

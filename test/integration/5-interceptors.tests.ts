import {sleep} from "../../src/sleep";
import soFetch, {SoFetchRequest} from "../../src/soFetch";
import {BaseTestUrl} from "./baseTestUrl";

function getTestHeaderValue(init?: RequestInit): string | null {
    if (!init || !init.headers) return null;

    const headers = init.headers;

    if (headers instanceof Headers) {
        // If it's a Headers object
        return headers.get('test-header');
    }

    if (Array.isArray(headers)) {
        // If it's an array of [key, value] pairs
        const found = headers.find(([key]) => key.toLowerCase() === 'test-header');
        return found ? found[1] : null;
    }

    // Otherwise, assume it's a Record<string, string>
    const record = headers as Record<string, string>;
    const key = Object.keys(record).find(k => k.toLowerCase() === 'test-header');
    return key ? record[key] : null;
}

describe("So Fetch interceptors", () => {
    it('Can add a header to the request via a SoFetchPromise beforeSend interceptor', done => {
        const promise = soFetch<{
            headers: Record<string, string>
        }>(`${BaseTestUrl}/interceptors/beforeSend`).beforeSend(req => {
            expect(req.url).toBe(`${BaseTestUrl}/interceptors/beforeSend`)
            expect(req.method).toBe('GET')
            expect(req.body).toBe(undefined)
            expect(req.headers).toStrictEqual({})
            req.headers["test-header"] = "Some Value"
            return req
        })
        promise.then(result => {
            expect(result.headers["test-header"]).toBe("Some Value")
            done()
        })
    })
    it('Can add a header to the request via the SoFetchConfig beforeSend interceptor', async () => {
        //Creating an independent instance here to prevent errors when this and other interceptor
        //tests run simultaneously:
        const soFetchInstance = soFetch.instance()
        soFetchInstance.config.beforeSend((req: SoFetchRequest) => {
            expect(req.url).toBe(`${BaseTestUrl}/interceptors/beforeSend`)
            expect(req.method).toBe('GET')
            expect(req.body).toBe(undefined)
            expect(req.headers).toStrictEqual({})
            req.headers["test-header"] = "Some Value, but from the config"
            return req
        })
        const result = await soFetchInstance<{
            headers: Record<string, string>
        }>(`${BaseTestUrl}/interceptors/beforeSend`)
        expect(result.headers["test-header"]).toBe("Some Value, but from the config")
    })
    it('Can receive an async before-send interceptor in the config', (done) => {
        //Creating an independent instance here to prevent errors when this and other interceptor
        //tests run simultaneously:
        const soFetchInstance = soFetch.instance()
        soFetchInstance.config.beforeSend(async (req: SoFetchRequest) => {
            await sleep(10)
            expect(req.url).toBe(`${BaseTestUrl}/interceptors/beforeSend`)
            expect(req.method).toBe('GET')
            expect(req.body).toBe(undefined)
            expect(req.headers).toStrictEqual({})
            req.headers["test-header"] = "Some value from a config async hook"
            return req
        })
        soFetchInstance<{ headers: Record<string, string> }>(`${BaseTestUrl}/interceptors/beforeSend`)
            .then(result => {
                expect(result.headers["test-header"]).toBe("Some value from a config async hook")
                done()
            })
    })
    it('Can receive async before-send interceptor on the request', done => {
        const promise = soFetch<{
            headers: Record<string, string>
        }>(`${BaseTestUrl}/interceptors/beforeSend`).beforeSend(async req => {
            await sleep(10)
            expect(req.url).toBe(`${BaseTestUrl}/interceptors/beforeSend`)
            expect(req.method).toBe('GET')
            expect(req.body).toBe(undefined)
            expect(req.headers).toStrictEqual({})
            req.headers["test-header"] = "Some async value"
            return req
        })
        promise.then(result => {
            expect(result.headers["test-header"]).toBe("Some async value")
            done()
        })
    })
    it('can attach a beforeFetchSend interceptor on the promise', done => {
        const promise = soFetch<{
            headers: Record<string, string>
        }>(`${BaseTestUrl}/interceptors/beforeSend`).beforeFetchSend(r => {
            r.headers = {"test-header": "Value set by beforeFetch", ...r.headers}
            return r
        }).beforeFetchSend(r => {
            //This interceptor should execute after the one above
            expect(r.headers).toBeTruthy()
            expect(getTestHeaderValue(r)).toBe("Value set by beforeFetch")
        })
        promise.then(result => {
            expect(result.headers["test-header"]).toBe("Value set by beforeFetch")
            done()
        })
    })
    it('can attach a beforeFetchSend interceptor on the config', async () => {
        const soFetchInstance = soFetch.instance()
        soFetchInstance.config.beforeFetchSend(r => {
            r.headers = {"test-header": "Value set by config beforeFetch", ...r.headers}
            return r
        })
        soFetchInstance.config.beforeFetchSend(r => {
            //This interceptor should execute after the one above
            expect(r.headers).toBeTruthy()
            expect(getTestHeaderValue(r)).toBe("Value set by config beforeFetch")
        })
        const result = await soFetchInstance<{
            headers: Record<string, string>
        }>(`${BaseTestUrl}/interceptors/beforeSend`)
        expect(result.headers["test-header"]).toBe("Value set by config beforeFetch")
    })
    it('can attach onRequestComplete interceptors on the promise', done => {
        const soFetchInstance = soFetch.instance()
        let syncRequestCompleteHandlerFired = false
        let asyncRequestCompleteHandlerFired = false
        soFetchInstance(`${BaseTestUrl}/interceptors/beforeSend`)
            .onRequestComplete(r => {
                syncRequestCompleteHandlerFired = true
            })
            .onRequestComplete(async r => {
                await sleep(10)
                asyncRequestCompleteHandlerFired = true
            }).then(() => {
            expect(syncRequestCompleteHandlerFired).toBeTruthy()
            expect(asyncRequestCompleteHandlerFired).toBeTruthy()
            done()
        })
    })
    it('can attach onRequestComplete interceptors on the config', done => {
        const soFetchInstance = soFetch.instance()
        let syncRequestCompleteHandlerFired = false
        let asyncRequestCompleteHandlerFired = false
        soFetchInstance.config.onRequestComplete(r => {
            syncRequestCompleteHandlerFired = true
        })
        soFetchInstance.config.onRequestComplete(async r => {
            await sleep(10)
            asyncRequestCompleteHandlerFired = true
        })
        soFetchInstance(`${BaseTestUrl}/interceptors/beforeSend`)
            .then(() => {
                expect(syncRequestCompleteHandlerFired).toBeTruthy()
                expect(asyncRequestCompleteHandlerFired).toBeTruthy()
                done()
            })
    })
})
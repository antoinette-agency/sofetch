import soFetch, {SoFetchRequest} from "../../src/soFetch";
import {BaseTestUrl} from "./baseTestUrl";

describe("So Fetch interceptors", () => {
    it('Can add a header to the request via a SoFetchPromise', done => {
        const promise = soFetch<{headers:Record<string,string>}>(`${BaseTestUrl}/interceptors/beforeSend`).beforeSend(req => {
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
    it('Can add a header to the request via the SoFetchConfig', async () => {
       soFetch.config.beforeSend((req:SoFetchRequest) => {
           expect(req.url).toBe(`${BaseTestUrl}/interceptors/beforeSend`)
           expect(req.method).toBe('GET')
           expect(req.body).toBe(undefined)
           expect(req.headers).toStrictEqual({})
           req.headers["test-header"] = "Some Value, but from the config"
           return req
       })
        const result = await soFetch<{headers:Record<string,string>}>(`${BaseTestUrl}/interceptors/beforeSend`)
        expect(result.headers["test-header"]).toBe("Some Value, but from the config")
    })
})
import {BaseTestUrl} from "./baseTestUrl.ts";
import soFetch from "../../src/soFetch.ts";

describe("Reading headers using SoFetch", () => {
    test("It can retrieve the HTTP response headers", (done) => {
        let onRequestSuccessFired = false
        soFetch<string>(`${BaseTestUrl}/reading-headers/get-header`).onRequestComplete((r:Response) => {
            expect(r.headers.get('sofetch-testheader')).toBe('A string value')
            onRequestSuccessFired = true
        }).then(r => {
            expect(r).toBe('A string result')
            expect(onRequestSuccessFired).toBeTruthy()
            done()
        })
    })
    test("It can add a response handler to read headers on all requests", async () => {
        let onRequestSuccessFired = false
        soFetch.config.onRequestComplete((r:Response, {duration, method}) => {
            expect(duration).toBeGreaterThan(0)
            expect(method).toBe("GET")
            expect(r.headers.get('sofetch-testheader')).toBe('A string value')
            onRequestSuccessFired = true
        })
        await soFetch<string>(`${BaseTestUrl}/reading-headers/get-header`)
        expect(onRequestSuccessFired).toBeTruthy()
    })
})
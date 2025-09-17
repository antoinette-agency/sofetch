import {BaseTestUrl} from "./baseTestUrl";
import soFetch from "../../src/soFetch";

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
    test("It can add a response handler to read headers on all requests", () => {
        soFetch<string>(`${BaseTestUrl}/reading-headers/get-header`)
    })
})
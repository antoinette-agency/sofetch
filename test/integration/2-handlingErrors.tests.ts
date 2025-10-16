import soFetch from "../../src/soFetch";
import {BaseTestUrl} from "./baseTestUrl";

describe("SoFetch can handle bad requests", () => {
    it('Will throw an error by default if it receives a >= 400 status code', async () => {
        const errorFunction = async () => {
            await soFetch(`${BaseTestUrl}/handling-errors`)
        }
        await expect(errorFunction()).rejects.toThrow(`Received response 400 from URL ${BaseTestUrl}/handling-errors`)
    })
    it('Will throw an error by default if a URL cannot be reached', async () => {
        const errorFunction = async () => {
            await soFetch("https://this.url.does.not.exist")
        }
        await expect(errorFunction()).rejects.toThrow("fetch failed")
    })
    it('Will catch an error if handled using catchHTTP', (done) => {
        soFetch(`${BaseTestUrl}/handling-errors`).catchHTTP(400, (res: Response) => {
            expect(res.url).toBe(`${BaseTestUrl}/handling-errors`)
            done()
        })
    })
    it('Can chain multiple errors together', (done) => {
        soFetch(`${BaseTestUrl}/handling-errors`).catchHTTP(400, (res: Response) => {
            expect(res.url).toBe(`${BaseTestUrl}/handling-errors`)
            done()
        })
        .catchHTTP(404, (res: Response) => {
            expect(res.url).toBe(`${BaseTestUrl}/handling-errors`)
        })
    })
    it('Will catch errors if specified in the config', (done) => {
        soFetch.config.catchHTTP(400, (res: Response) => {
            expect(res.url).toBe(`${BaseTestUrl}/handling-errors`)
            done()
        })
        soFetch(`${BaseTestUrl}/handling-errors`)
    })
    it('Will not execute a config handler if superseded by a request handler', async () => {
        let requestHandlerFired = false
        let configHandlerFired = false
        soFetch.config.catchHTTP(400, (res: Response) => {
            configHandlerFired = true
        })
        await soFetch(`${BaseTestUrl}/handling-errors`).catchHTTP(400, (res: Response) => {
            requestHandlerFired = true
        })
        expect(requestHandlerFired).toBeTruthy()
        expect(configHandlerFired).toBeFalsy()
    })
})
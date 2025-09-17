import soFetch from "../../src/soFetch";

describe("SoFetch can handle bad requests", ()=>{
    it('Will throw an error by default if it receives a >= 400 status code', async () =>{
        const errorFunction = async() =>{ await soFetch("http://localhost:3000/handling-errors")}
        await expect(errorFunction()).rejects.toThrow("Received response 400 from URL http://localhost:3000/handling-errors")
    })
    it('Will throw an error by default if a URL cannot be reached', async () =>{
        const errorFunction = async() =>{ await soFetch("https://this.url.does.not.exist")}
        await expect(errorFunction()).rejects.toThrow("fetch failed")
    })
    it('Will catch an error if handled using catchHTTP', (done) => {
        soFetch("http://localhost:3000/handling-errors").catchHTTP(400, (res:Response) => {
            expect(res.url).toBe("http://localhost:3000/handling-errors")
            done()
        })
    })
    it('Will catch errors if specified in the config', (done) => {
        soFetch.config.addHTTPHandler(400, (res:Response) => {
            expect(res.url).toBe("http://localhost:3000/handling-errors")
            done()
        })
        soFetch("http://localhost:3000/handling-errors")
    })
    it ('Passes error response to handlers in the request before those in the config', (done) => {
        let requestHandlerFired = false
        soFetch.config.addHTTPHandler(400, (res:Response) => {
            expect(requestHandlerFired).toBeTruthy()
            expect(res.url).toBe("http://localhost:3000/handling-errors")
            done()
        })
        soFetch("http://localhost:3000/handling-errors").catchHTTP(400, (res:Response) => {
            requestHandlerFired = true
            expect(res.url).toBe("http://localhost:3000/handling-errors")
        })
    })
})
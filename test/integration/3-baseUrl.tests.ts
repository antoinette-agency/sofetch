import soFetch from "../../src/soFetch";

describe("Configuring SoFetch", () => {
    it("Can be assigned a default base URL", done => {
        soFetch.config.baseUrl = "http://localhost:3000"
        soFetch("/ping").onRequestComplete(r => {
            expect(r.url).toBe("http://localhost:3000/ping")
            done()
        })
    })
})
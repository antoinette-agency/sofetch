import soFetch from "../../src/soFetch";
import {BaseTestUrl} from "./baseTestUrl";

describe("Configuring SoFetch", () => {
    it("Can be assigned a default base URL", done => {
        soFetch.config.baseUrl = BaseTestUrl
        soFetch("/ping").onRequestComplete(r => {
            expect(r.url).toBe(`${BaseTestUrl}/ping`)
            done()
        })
    })
})
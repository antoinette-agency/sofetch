import {BaseTestUrl} from "./baseTestUrl.ts";
import soFetch from "../../src/soFetch.ts";

const url = `${BaseTestUrl}/interceptors/beforeSend`

describe("SoFetch userAgent handling", () => {
    it("can set the user agent", async() => {
        soFetch.config.setUserAgent({browser:"Chrome", OS:"Windows"})
        const {headers} = (await soFetch.get<{
            headers: Record<string, string>
        }>(url)) as {
            headers: Record<string, string>
        }
        expect(headers["user-agent"]).toBe("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36")
    })
    it("can set an arbitrary user agent string", async() => {
        soFetch.config.setUserAgent({userAgentString:"Custom user agent string"})
        const {headers} = (await soFetch.get<{
            headers: Record<string, string>
        }>(url)) as {
            headers: Record<string, string>
        }
        expect(headers["user-agent"]).toBe("Custom user agent string")
    })
    it("throws error if invalid user agent set", async() => {
        const action = () => {
            soFetch.config.setUserAgent({OS:"Windows", browser:"Safari"})
        }
        expect(action).toThrow("No user agent defined for OS Windows and browser Safari")
    })
})
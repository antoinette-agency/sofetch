import soFetch from "../../src/soFetch";
import {BaseTestUrl} from "./baseTestUrl";

describe("The SoFetch authentication helpers", () => {
    it('can send a basic authentication header', async () => {
        soFetch.config.setBasicAuthentication({username:"Chris Hodges", password:"Antoinette"})
        const result = await soFetch<{username:string, password:string}>(`${BaseTestUrl}/authentication/basic`)
        expect(result.username).toBe("Chris Hodges")
        expect(result.password).toBe("Antoinette")
    })
    it('can set a bearer token', async () => {
        soFetch.config.setBearerToken("SOME_ACCESS_TOKEN")
        const result = await soFetch<{token:string}>(`${BaseTestUrl}/authentication/bearerToken`)
        expect(result.token).toBe("SOME_ACCESS_TOKEN")
    })
    it('can set header API key', async () => {
        soFetch.config.setHeaderApiKey({headerName:"api-key", value:"HEADER_ACCESS_TOKEN"})
        const result = await soFetch<{headerName:string, value:string}>(`${BaseTestUrl}/authentication/headerApiKey`)
        expect(result.headerName).toBe("api-key")
        expect(result.value).toBe("HEADER_ACCESS_TOKEN")
    })
    it('can set query string API key', async () => {
        soFetch.config.setQueryStringApiKey({paramName:"api-key", value:"QUERY_STRING_ACCESS_TOKEN"})
        const result = await soFetch<{paramName:string, value:string}>(`${BaseTestUrl}/authentication/querystringApiKey`)
        expect(result.paramName).toBe("api-key")
        expect(result.value).toBe("QUERY_STRING_ACCESS_TOKEN")
    })
})
import soFetch from "../../src/soFetch";
import {BaseTestUrl} from "./baseTestUrl";
import {getCookie} from "../../src/cookieTypescriptUtils";

describe("The SoFetch authentication helpers", () => {
    it('can use basic authentication', async () => {
        const soFetchInstance = soFetch.instance()
        soFetchInstance.config.useBasicAuthentication({
            username:"Chris Hodges", 
            password:"Antoinette",
            authenticationKey: "BASIC_AUTH_KEY",
            authTokenStorage: "memory"
        })
        expect(soFetchInstance.config.authenticationKey).toBe("BASIC_AUTH_KEY")
        expect(soFetchInstance.config.authTokenStorage).toBe("memory")
        expect(await soFetchInstance.config["getAuthToken"]()).toBe("Q2hyaXMgSG9kZ2VzOkFudG9pbmV0dGU=")

        soFetchInstance.config.useBasicAuthentication({username:"Matt Brewerton", password:"Is Great"})
        expect(await soFetchInstance.config["getAuthToken"]()).toBe("TWF0dCBCcmV3ZXJ0b246SXMgR3JlYXQ=")
        
        const result = await soFetchInstance<{username:string, password:string}>(`${BaseTestUrl}/authentication/basic`)
        expect(result.username).toBe("Matt Brewerton")
        expect(result.password).toBe("Is Great")
    })
    it('can use bearer authentication', async () => {
        const soFetchInstance = soFetch.instance()
        soFetchInstance.config.useBearerAuthentication({
            authTokenStorage:"memory"
        })
        soFetchInstance.config.setAuthToken("SOME_ACCESS_TOKEN")
        const result = await soFetchInstance<{token:string}>(`${BaseTestUrl}/authentication/bearerToken`)
        expect(result.token).toBe("SOME_ACCESS_TOKEN")
    })
    it('can use header authentication', async () => {
        const soFetchInstance = soFetch.instance()
        soFetchInstance.config.useHeaderAuthentication({
            authTokenStorage:"memory",
            authToken:"HEADER_ACCESS_TOKEN",
            headerKey:"api-key",
        })
        const result = await soFetchInstance<{headerName:string, value:string}>(`${BaseTestUrl}/authentication/headerApiKey`)
        expect(result.headerName).toBe("api-key")
        expect(result.value).toBe("HEADER_ACCESS_TOKEN")
    })
    it('can use query string authentication', async () => {
        const soFetchInstance = soFetch.instance()
        soFetchInstance.config.useQueryStringAuthentication({
            authTokenStorage:"memory",
            authToken:"QUERY_STRING_ACCESS_TOKEN",
            queryStringKey:"api-key",
        })
        const result = await soFetchInstance<{paramName:string, value:string}>(`${BaseTestUrl}/authentication/querystringApiKey`)
        expect(result.paramName).toBe("api-key")
        expect(result.value).toBe("QUERY_STRING_ACCESS_TOKEN")
    })
    it('can use cookie authentication', async () => {
        const soFetchInstance = soFetch.instance()
        soFetchInstance.config.useCookieAuthentication({})
        soFetchInstance.config.setAuthToken("COOKIES_AUTH_TOKEN")
        const {cookies} = await soFetchInstance<{cookies:string}>(`${BaseTestUrl}/authentication/cookies`)
        expect(cookies).toEqual('SOFETCH_AUTHENTICATION1=COOKIES_AUTH_TOKEN')
    })
})

describe('getCookie', () => {
    it('can get a single cookie from a cookie string', () => {
        const cookieString = "JWT_TOKEN=SOME_AUTH_TOKEN"
        const result = getCookie("JWT_TOKEN", cookieString)
        expect(result).toBe("SOME_AUTH_TOKEN")
    })
    it('can get a single cookie from a multiple cookie string', () => {
        const cookieString = "SOFETCH_AUTHENTICATION1=COOKIES_AUTH_TOKEN; JWT_TOKEN=SOME_AUTH_TOKEN"
        const result = getCookie("JWT_TOKEN", cookieString)
        expect(result).toBe("SOME_AUTH_TOKEN")
    })
})
const fs = require('fs')

function getCookie(name) {
    if (typeof(document) === "undefined") {
        return;
    }
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");

    if (parts.length === 2) {
        return parts.pop()?.split(";").shift();
    }
}

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

const scriptPath = 'C:\\Users\\chris\\soFetch\\index.browser.js'

beforeEach(async () => {
    await page.goto('https://localhost:3000/ping');
    const scriptContents = fs.readFileSync(scriptPath, {encoding:'utf-8'})
    await page.addScriptTag({
        content:`${scriptContents}`,
        type:'module'
    })
    await page.addScriptTag({
        content:`const BaseTestUrl = "https://localhost:3000"`,
    })
}, 30000)

describe("The SoFetch authentication helpers", () => {
    it('can use basic authentication', async () => {
        const result = await page.evaluate(async () => {
            const soFetchInstance = soFetch.instance()
            soFetchInstance.config.useBasicAuthentication({
                username:"Chris Hodges",
                password:"Antoinette",
                authenticationKey: "BASIC_AUTH_KEY",
                authTokenStorage: "sessionStorage"
            })
            const token = sessionStorage.getItem("BASIC_AUTH_KEY")
            const response = await soFetchInstance(`${BaseTestUrl}/authentication/basic`)
            return {token, response, config:soFetchInstance.config}
        });
        expect(result.response.username).toBe("Chris Hodges")
        expect(result.response.password).toBe("Antoinette")
        expect(result.token).toBe("Q2hyaXMgSG9kZ2VzOkFudG9pbmV0dGU=")
    }, 30000)
    it('can use bearer authentication', async () => {
        const result = await page.evaluate(async () => {
            const soFetchInstance = soFetch.instance()
            soFetchInstance.config.useBearerAuthentication()
            soFetchInstance.config.setAuthToken("SOME_ACCESS_TOKEN")
            const {token} = await soFetchInstance(`${BaseTestUrl}/authentication/bearerToken`)
            const storedToken = sessionStorage.getItem("SOFETCH_AUTHENTICATION1")
            return {token, storedToken}
        })
        expect(result.token).toBe("SOME_ACCESS_TOKEN")
        expect(result.storedToken).toBe("SOME_ACCESS_TOKEN")
    })
    it('can use header authentication', async () => {
        const result = await page.evaluate(async () => {
            const soFetchInstance = soFetch.instance()
            soFetchInstance.config.useHeaderAuthentication({
                authTokenStorage: "localStorage",
                authToken: "HEADER_ACCESS_TOKEN",
                headerKey: "api-key",
            })
            const {headerName, value} = await soFetchInstance (`${BaseTestUrl}/authentication/headerApiKey`)
            const storedToken = localStorage.getItem("SOFETCH_AUTHENTICATION1")
            return {headerName, value, storedToken}
        })
        expect(result.headerName).toBe("api-key")
        expect(result.value).toBe("HEADER_ACCESS_TOKEN")
        expect(result.storedToken).toBe("HEADER_ACCESS_TOKEN")
    })
    it('can use query string authentication', async () => {
        const result = await page.evaluate(async () => {
            const soFetchInstance = soFetch.instance()
            soFetchInstance.config.useQueryStringAuthentication({
                authTokenStorage: "localStorage",
                authToken: "QUERY_STRING_ACCESS_TOKEN",
                queryStringKey: "api-key",
            })
            const {paramName, value} = await soFetchInstance(`${BaseTestUrl}/authentication/querystringApiKey`)
            return {paramName, value}
        })
        expect(result.paramName).toBe("api-key")
        expect(result.value).toBe("QUERY_STRING_ACCESS_TOKEN")
    })
    it('can use cookie authentication', async () => {
        const result = await page.evaluate(async () => {
            const soFetchInstance = soFetch.instance()
            soFetchInstance.config.baseUrl = BaseTestUrl;
            soFetchInstance.config.useCookieAuthentication()
            soFetchInstance.config.setAuthToken("COOKIES_AUTH_TOKEN")
            const documentCookie = document.cookie
            let requestInit
            soFetchInstance.config.beforeFetchSend(r => {
                requestInit = r
            })
            const {cookies} = await soFetchInstance(`${BaseTestUrl}/authentication/cookies`)
            return {documentCookie, responseCookies: cookies}
        })
        expect(result.documentCookie).toEqual('SOFETCH_AUTHENTICATION1=COOKIES_AUTH_TOKEN')
        expect(result.responseCookies).toEqual('SOFETCH_AUTHENTICATION1=COOKIES_AUTH_TOKEN')
    })
})

import soFetch from "../../src/soFetch.ts";
import {BaseTestUrl} from "./baseTestUrl";

describe("SoFetch empty response options", () => {
    it('will return "true" from an empty 200 response by default', async () => {
        const instance = soFetch.instance()
        const response = await instance<boolean>(`${BaseTestUrl}/empty-responses/200`)
        expect(response).toBe(true)
    })
    it('will return actual response from an empty 200 response if set in config', async () => {
        const instance = soFetch.instance()
        instance.config.coerceEmptySuccessToTrue = false
        const response = await instance<boolean>(`${BaseTestUrl}/empty-responses/200`)
        expect(response).toBe("")
    })
    it('will return true from empty 200 response if set in request', async () => {
        const instance = soFetch.instance()
        instance.config.coerceEmptySuccessToTrue = false
        const response = await instance<boolean>(`${BaseTestUrl}/empty-responses/200`)
            .coerceEmptySuccessToTrue(true)
        expect(response).toBe(true)
    })
    it('will return actual response from 200 if set explicitly in request', async () => {
        const instance = soFetch.instance()
        const response = await instance<boolean>(`${BaseTestUrl}/empty-responses/200`)
            .coerceEmptySuccessToTrue(false)
        expect(response).toBe("")
    })
    
    
    it('will return "true" from an empty 204 response by default', async () => {
        const instance = soFetch.instance()
        const response = await instance<boolean>(`${BaseTestUrl}/empty-responses/204`)
        expect(response).toBe(true)
    })
    it('will return actual response from an empty 204 response if set in config', async () => {
        const instance = soFetch.instance()
        instance.config.coerceEmptySuccessToTrue = false
        const response = await instance<boolean>(`${BaseTestUrl}/empty-responses/204`)
        expect(response).toBe("")
    })
    it('will return true from empty 204 response if set in request', async () => {
        const instance = soFetch.instance()
        instance.config.coerceEmptySuccessToTrue = false
        const response = await instance<boolean>(`${BaseTestUrl}/empty-responses/204`)
            .coerceEmptySuccessToTrue(true)
        expect(response).toBe(true)
    })
    it('will return actual response from 204 if set explicitly in request', async () => {
        const instance = soFetch.instance()
        const response = await instance<boolean>(`${BaseTestUrl}/empty-responses/204`)
            .coerceEmptySuccessToTrue(false)
        expect(response).toBe("")
    })
})
import soFetch from "../../src/soFetch";
import {BaseTestUrl} from "./baseTestUrl";

describe("SoFetch explicit GET, POST, PUT, PATCH and DELETE methods",() => {
    it('Can send a GET request', async () => {
        const result = await soFetch.get(`${BaseTestUrl}/return-method-and-body`)
        expect(result).toStrictEqual({method:"GET"})
    })
    it('Can send a POST request', async () => {
        const body = {
            key:"value"
        }
        const result = await soFetch.post(`${BaseTestUrl}/return-method-and-body`, body)
        expect(result).toStrictEqual({method:"POST", body})
    })
    it('Can send a PUT request', async () => {
        const body = {
            key:"value"
        }
        const result = await soFetch.put(`${BaseTestUrl}/return-method-and-body`, body)
        expect(result).toStrictEqual({method:"PUT", body})
    })
    it('Can send a PATCH request', async () => {
        const body = {
            key:"value"
        }
        const result = await soFetch.patch(`${BaseTestUrl}/return-method-and-body`, body)
        expect(result).toStrictEqual({method:"PATCH", body})
    })
    it('Can send a DELETE request', async () => {
        const body = {
            key:"value"
        }
        const result = await soFetch.delete(`${BaseTestUrl}/return-method-and-body`, body)
        expect(result).toStrictEqual({method:"DELETE", body})
    })
})
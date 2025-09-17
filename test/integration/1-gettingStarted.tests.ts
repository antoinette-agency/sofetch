import soFetch from "../../src/soFetch";
import {BaseTestUrl} from "./baseTestUrl";

describe("The basic functions of SoFetch", () => {
    test("It can receive a JSON string result", async () => {
        const result = await soFetch<string>(`${BaseTestUrl}/getting-started/get-string`)
        expect(result).toBe("String result")
    })
    test("It can receive a JSON number result", async () => {
        const result = await soFetch<string>(`${BaseTestUrl}/getting-started/get-number`)
        expect(result).toBe(42)
    })
    test("It can receive a JSON boolean result", async () => {
        const result = await soFetch<string>(`${BaseTestUrl}/getting-started/get-boolean`)
        expect(result).toBe(true)
    })
    test("It can receive an empty result", async () => {
        const result = await soFetch<undefined>(`${BaseTestUrl}/getting-started/get-empty-result`)
        expect(result).toBe(undefined)
    })
    test("It can receive a basic JSON object from a GET request", async () => {
        interface Poco {
            str:string
            num:number
            array: [
                1,2,3,4,5
            ]
            child?:Poco
        }
        const result:Poco = await soFetch<Poco>(`${BaseTestUrl}/getting-started/get-poco`)
        expect(JSON.stringify(result)).toEqual(JSON.stringify({
            str:"string",
            num:42,
            array: [1,2,3,4,5],
            child: {
                str:"string2",
                num:43,
                array:[9,8,7,6,5]
            }
        }))
    })
    test("It POSTs data by default if supplied as a second argument", async () => {
        const postData = {some:"payload"}
        const result = await soFetch<{requestMethod:string,body:{some:string}}>(`${BaseTestUrl}/return-method-and-body`, postData)
        expect(JSON.stringify(result)).toBe(JSON.stringify({
            method:"POST",
            body:{some:"payload"},
        }))
    })
})
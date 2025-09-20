import soFetch from "../../src/soFetch.ts";
import SoFetchLike from "../../src/soFetch.ts";
import {BaseTestUrl} from "./baseTestUrl";
describe("Running multiple instances of SoFetch with different configs", () => {
    it('Can create an independent SoFetch instance', () => {
        soFetch.config.baseUrl = "https://my-initial-config.com"
        const onRequestCompleteHandler = (r:Response) => {
            //Does nothing - just need to check it exists
        }
        soFetch.config.onRequestComplete(onRequestCompleteHandler)
        
        const separateInstance:typeof SoFetchLike = soFetch.instance()
        expect(separateInstance.config.baseUrl).toBe("https://my-initial-config.com")
        
        soFetch.config.baseUrl = "https://changed-on-initial-config.com"
        expect(soFetch.config.baseUrl).toBe("https://changed-on-initial-config.com")
        expect(separateInstance.config.baseUrl).toBe("https://my-initial-config.com")

        separateInstance.config.baseUrl = "https://changed-on-separate-instance.com"
        expect(separateInstance.config.baseUrl).toBe("https://changed-on-separate-instance.com")
        expect(soFetch.config.baseUrl).toBe("https://changed-on-initial-config.com")
        
        expect(separateInstance.config.onRequestComplete).toBeDefined()
        expect(separateInstance.config.onRequestCompleteHandlers[0]).toBe(soFetch.config.onRequestCompleteHandlers[0])
    })
    it('Can fire onRequestCompleteHandlers on new instances', async () => {
        const instance = soFetch.instance()
        expect(instance.config).not.toBe(soFetch.config)
        let onRequestCompleteFired = false
        instance.config.onRequestComplete(r => {
            onRequestCompleteFired = true
        })
        expect(instance.config.onRequestCompleteHandlers.length).toBeGreaterThan(0)
        await instance(`${BaseTestUrl}/ping`)
        expect(onRequestCompleteFired).toBeTruthy()
    })
})
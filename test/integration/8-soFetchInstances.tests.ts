import soFetch from "../../src/soFetch.ts";
import SoFetchLike from "../../src/soFetch.ts";
describe("Running multiple instances of SoFetch with different configs", () => {
    it('Can create an independent SoFetch instance', () => {
        soFetch.config.baseUrl = "https://my-initial-config.com"
        
        const separateInstance:typeof SoFetchLike = soFetch.instance()
        expect(separateInstance.config.baseUrl).toBe("https://my-initial-config.com")
        
        soFetch.config.baseUrl = "https://changed-on-initial-config.com"
        expect(soFetch.config.baseUrl).toBe("https://changed-on-initial-config.com")
        expect(separateInstance.config.baseUrl).toBe("https://my-initial-config.com")

        separateInstance.config.baseUrl = "https://changed-on-separate-instance.com"
        expect(separateInstance.config.baseUrl).toBe("https://changed-on-separate-instance.com")
        expect(soFetch.config.baseUrl).toBe("https://changed-on-initial-config.com")
    })
})
import {BaseTestUrl} from "./baseTestUrl.ts";
import soFetch from "../../src/soFetch.ts";

describe("SoFetch timeout handling", () => {
    it("Times out gracefully for a request that never returns", async() => {
        const testFunction = async () => {
            await soFetch(`${BaseTestUrl}/timeouts/neverReturn`).setTimeout(2000)
        }
        const start = Date.now();
        await expect(testFunction()).rejects.toThrow("SoFetch timed out")
        const duration = Date.now() - start;
        expect(duration).toBeGreaterThanOrEqual(1900); // ~2s
        expect(duration).toBeLessThanOrEqual(2100);
    }, 1000 * 30)
})
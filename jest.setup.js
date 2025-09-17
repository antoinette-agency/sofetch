"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = globalSetup;
const child_process_1 = require("child_process");
const SERVER_URL = "http://localhost:3000/ping";
const SERVER_START_TIMEOUT = 10000; // 10 seconds
let server;
async function waitForServer(url, timeout) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        try {
            const res = await fetch(url);
            if (res.ok)
                return;
        }
        catch {
            // ignore errors
        }
        await new Promise((r) => setTimeout(r, 200));
    }
    throw new Error(`Server did not start within ${timeout}ms`);
}
async function globalSetup() {
    console.log("Starting test server...");
    server = (0, child_process_1.spawn)("npx", ["tsx", "testServer\\testServer.ts"], {
        stdio: "inherit",
        shell: true,
    });
    console.log("Waiting for server to be ready...");
    await waitForServer(SERVER_URL, SERVER_START_TIMEOUT);
    console.log("Server is ready!");
    // Expose the process to globalThis so teardown can access it
    globalThis.__TEST_SERVER__ = server;
}

import { spawn, ChildProcess } from "child_process";
import * as path from "node:path";

const SERVER_URL = "http://localhost:3000/ping";
const SERVER_START_TIMEOUT = 10000; // 10 seconds

let server: ChildProcess;

async function waitForServer(url: string, timeout: number) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        try {
            const res = await fetch(url);
            if (res.ok) return;
        } catch {
            // ignore errors
        }
        await new Promise((r) => setTimeout(r, 200));
    }
    throw new Error(`Server did not start within ${timeout}ms`);
}

export default async function globalSetup() {
    console.log("Starting test server...");
    server = spawn( "npx", 
        ["tsx","testServer\\testServer.ts"], 
        { 
            stdio: "inherit",
            shell: true,
        }
    );

    console.log("Waiting for server to be ready...");
    await waitForServer(SERVER_URL, SERVER_START_TIMEOUT);

    // Expose the process to globalThis so teardown can access it
    (globalThis as any).__TEST_SERVER__ = server;
}
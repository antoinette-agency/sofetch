import kill from "tree-kill";

export default async function globalTeardown() {
    const server = (globalThis as any).__TEST_SERVER__;
    if (server && server.pid) {
        console.log("Shutting down test server...");
        await new Promise<void>((resolve) => {
            kill(server.pid, "SIGKILL", () => resolve());
        });
    }
}
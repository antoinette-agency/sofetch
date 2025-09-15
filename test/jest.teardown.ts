export default async function globalTeardown() {
    const server = (globalThis as any).__TEST_SERVER__;
    if (server) {
        console.log("Shutting down test server...");
        server.kill();
    }
}
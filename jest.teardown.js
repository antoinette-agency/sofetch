"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = globalTeardown;
async function globalTeardown() {
    const server = globalThis.__TEST_SERVER__;
    if (server) {
        console.log("Shutting down test server...");
        server.kill();
    }
}

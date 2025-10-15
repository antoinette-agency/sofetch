import https from 'node:https';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

interface ServerOptions {
    port?: number;
    certDir?: string;
}

export async function createTrustedHttpsServer(
    requestListener: (req: any, res: any) => void,
    options: ServerOptions = {}
): Promise<https.Server> {
    const port = options.port || 3000;
    const certDir = options.certDir || path.join(process.cwd(), '.certs');

    // Ensure cert directory exists
    if (!fs.existsSync(certDir)) {
        fs.mkdirSync(certDir, { recursive: true });
    }

    const keyPath = path.join(certDir, 'localhost-key.pem');
    const certPath = path.join(certDir, 'localhost.pem');

    // Check if mkcert is installed
    if (!isMkcertInstalled()) {
        throw new Error(
            'mkcert is not installed. Please install it:\n' +
            '  Windows: choco install mkcert (or download from https://github.com/FiloSottile/mkcert/releases)\n' +
            '  Linux: sudo apt install mkcert (Ubuntu/Debian) or check https://github.com/FiloSottile/mkcert\n' +
            '  macOS: brew install mkcert'
        );
    }

    // Install local CA if needed (first time setup)
    ensureMkcertCAInstalled();

    // Generate certificates if they don't exist
    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
        console.log('Generating trusted certificate with mkcert...');
        generateMkcertCertificate(certDir, keyPath, certPath);
    }

    // Create HTTPS server
    const httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
    };

    const server = https.createServer(httpsOptions, requestListener);

    server.listen(port, 'localhost', () => {
        console.log(`✓ HTTPS server running at https://localhost:${port}/`);
        console.log('✓ Certificate is trusted by your system');
    });

    return server;
}

function isMkcertInstalled(): boolean {
    try {
        execSync('mkcert -version', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

function ensureMkcertCAInstalled(): void {
    try {
        // Check if CA is already installed by looking for CAROOT
        const caroot = execSync('mkcert -CAROOT', { encoding: 'utf-8' }).trim();
        const rootCertPath = path.join(caroot, 'rootCA.pem');

        if (!fs.existsSync(rootCertPath)) {
            console.log('Installing mkcert local CA (may require password)...');
            execSync('mkcert -install', { stdio: 'inherit' });
            console.log('✓ Local CA installed successfully');
        }
    } catch (error) {
        console.warn('Warning: Could not verify/install mkcert CA');
        throw error;
    }
}

function generateMkcertCertificate(
    certDir: string,
    keyPath: string,
    certPath: string
): void {
    try {
        // mkcert creates files with specific naming, so we generate and rename
        const cmd = `mkcert -key-file "${keyPath}" -cert-file "${certPath}" localhost 127.0.0.1 ::1`;
        execSync(cmd, { cwd: certDir, stdio: 'inherit' });
        console.log('✓ Certificate generated successfully');
    } catch (error) {
        throw new Error('Failed to generate certificate with mkcert');
    }
}

// Example usage:
/*export async function startServer() {
    const server = await createTrustedHttpsServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
      <!DOCTYPE html>
      <html>
        <head><title>HTTPS Server</title></head>
        <body>
          <h1>🔒 Hello, Secure World!</h1>
          <p>This connection is secured with a trusted certificate.</p>
        </body>
      </html>
    `);
    }, {
        port: 3000
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\nShutting down server...');
        server.close(() => {
            console.log('Server closed');
            process.exit(0);
        });
    });

    return server;
}

// Start the server if this file is run directly
startServer().catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
});*/
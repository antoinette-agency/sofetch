// esbuild.config.js
import { build } from "esbuild";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function runBuilds() {
    // 1. Node.js - CommonJS
    await build({
        entryPoints: ["src/index.ts"],
        bundle: true,
        platform: "node",
        target: ["node18"],
        format: "cjs",              // CommonJS
        outfile: "dist/index.cjs",
        minify: true,
        sourcemap: true,
    });

    // 2. Node.js - ESM
    await build({
        entryPoints: ["src/index.ts"],
        bundle: true,
        platform: "node",
        target: ["node18"],
        format: "esm",              // ES Modules
        outfile: "dist/index.mjs",
        minify: true,
        sourcemap: true,
    });

    // 3. Browser - ESM
    await build({
        entryPoints: ["src/index.ts"],
        bundle: true,
        platform: "browser",
        target: ["es2017"],
        format: "esm",              // Browsers prefer ESM
        outfile: "dist/index.browser.js",
        minify: true,
        sourcemap: true,
    });

    // 4. Type Declarations
    await execAsync("tsc -p tsconfig.build.json");
    await execAsync("npx api-extractor run --local");

    console.log("✅ All builds completed!");
}

runBuilds().catch((err) => {
    console.error(err);
    process.exit(1);
});

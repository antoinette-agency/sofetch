// scripts/process-control.js
import { spawn, execSync } from "child_process";
import fs from "fs";

const pidFile = ".pidfile";
const action = process.argv[2];

if (action === "start") {
    // Start your process
    const child = spawn("npm",["run","test-server"], {
        detached: true,
        stdio: "ignore", // don't tie to current terminal
    });
    child.unref(); // let it run independently
    fs.writeFileSync(pidFile, String(child.pid));
    console.log(`Started process with PID ${child.pid}`);
}

else if (action === "stop") {
    if (!fs.existsSync(pidFile)) {
        console.error("No PID file found — is the process running?");
        process.exit(1);
    }

    const pid = fs.readFileSync(pidFile, "utf8").trim();

    try {
        if (process.platform === "win32") {
            execSync(`taskkill /PID ${pid} /F`);
        } else {
            process.kill(pid);
        }
        console.log(`Stopped process ${pid}`);
        fs.unlinkSync(pidFile);
    } catch (err) {
        console.error(`Failed to stop process ${pid}:`, err.message);
    }
}

else {
    console.log("Usage: node scripts/process-control.js [start|stop]");
}

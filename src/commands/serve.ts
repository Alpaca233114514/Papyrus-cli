/**
 * Papyrus CLI - Server Management Commands
 */

import { spawn } from "child_process";
import { existsSync } from "fs";
import { join, resolve } from "path";
import { getApiUrl } from "../config.js";
import { healthCheck, isApiAvailable } from "../api.js";

/**
 * Find Papyrus project root
 */
function findPapyrusRoot(): string | null {
  // Check common locations
  const candidates = [
    resolve("../Papyrus"),
    resolve("../../Papyrus"),
    join(process.cwd(), "Papyrus"),
    join(process.cwd(), "..", "Papyrus"),
  ];

  for (const candidate of candidates) {
    if (existsSync(join(candidate, "src", "papyrus_api", "main.py"))) {
      return candidate;
    }
  }

  return null;
}

/**
 * Start server command
 */
export async function serveCommand(options: {
  port?: number;
  host?: string;
  detach?: boolean;
}): Promise<void> {
  const papyrusRoot = findPapyrusRoot();

  if (!papyrusRoot) {
    console.error("Could not find Papyrus project root.");
    console.error("Make sure Papyrus is installed in the parent directory.");
    process.exit(1);
  }

  const port = options.port || 8000;
  const host = options.host || "127.0.0.1";

  console.log(`Starting Papyrus API server...`);
  console.log(`  Root: ${papyrusRoot}`);
  console.log(`  Host: ${host}`);
  console.log(`  Port: ${port}`);

  const env = {
    ...process.env,
    PYTHONPATH: join(papyrusRoot, "src"),
  };

  const args = [
    "-m",
    "uvicorn",
    "src.papyrus_api.main:app",
    "--host",
    host,
    "--port",
    port.toString(),
  ];

  if (options.detach) {
    // Detached mode - run in background
    const { spawn: spawnWin } = await import("child_process");
    const child = spawnWin("python", args, {
      cwd: papyrusRoot,
      env,
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    });

    child.unref();

    console.log(`\n✅ Server started in background (PID: ${child.pid})`);
    console.log(`   API: http://${host}:${port}`);
    console.log(`   Docs: http://${host}:${port}/docs`);

    // Wait a moment and check if it's running
    await new Promise((r) => setTimeout(r, 2000));

    if (await isApiAvailable()) {
      console.log("   Status: Running ✓");
    } else {
      console.log("   Status: May have failed to start. Check logs.");
    }
  } else {
    // Foreground mode
    console.log(`\nPress Ctrl+C to stop\n`);

    const child = spawn("python", args, {
      cwd: papyrusRoot,
      env,
      stdio: "inherit",
    });

    child.on("close", (code) => {
      if (code !== 0) {
        console.error(`Server exited with code ${code}`);
        process.exit(code || 1);
      }
    });
  }
}

/**
 * Check server status
 */
export async function statusCommand(): Promise<void> {
  console.log("\n🔍 Papyrus Server Status\n");

  const apiUrl = getApiUrl();
  console.log(`  API URL: ${apiUrl}`);

  const available = await isApiAvailable();

  if (available) {
    try {
      const health = await healthCheck();
      console.log(`  Status: ${health.status === "ok" ? "✅ Running" : "⚠️ Unknown"}`);

      // Get additional stats
      const { getReviewStats } = await import("../api.js");
      const stats = await getReviewStats();
      console.log(`\n  📊 Database Stats:`);
      console.log(`     Total Cards: ${stats.stats.total_cards}`);
      console.log(`     Due Today: ${stats.stats.due_today}`);
    } catch {
      console.log("  Status: ⚠️ API available but returned error");
    }
  } else {
    console.log("  Status: ❌ Not running");
    console.log(`\n  Start with: papyrus serve`);
  }
}

/**
 * Stop server command (if running in background)
 */
export async function stopCommand(): Promise<void> {
  const { exec } = await import("child_process");
  const { promisify } = await import("util");
  const execAsync = promisify(exec);

  console.log("Stopping Papyrus server...");

  try {
    // Find and kill uvicorn processes
    if (process.platform === "win32") {
      await execAsync(`taskkill /F /IM python.exe /FI "WINDOWTITLE eq uvicorn*"`);
    } else {
      await execAsync(`pkill -f "uvicorn.*papyrus_api"`);
    }

    console.log("✅ Server stopped.");
  } catch {
    console.log("Server may not be running or could not be stopped.");
  }
}

/**
 * Open API documentation
 */
export async function docsCommand(): Promise<void> {
  const apiUrl = getApiUrl();
  const docsUrl = `${apiUrl}/docs`;

  console.log(`Opening API documentation: ${docsUrl}`);

  const { exec } = await import("child_process");
  const command =
    process.platform === "win32"
      ? `start "" "${docsUrl}"`
      : process.platform === "darwin"
        ? `open "${docsUrl}"`
        : `xdg-open "${docsUrl}"`;

  exec(command, (error) => {
    if (error) {
      console.log(`Please open manually: ${docsUrl}`);
    }
  });
}

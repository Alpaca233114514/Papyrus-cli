import { describe, expect, it, beforeEach, afterEach } from "@jest/globals";
import { existsSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import {
  loadConfig,
  saveConfig,
  getConfig,
  setConfig,
  resetConfig,
  getApiUrl,
  getDataDir,
} from "./config.js";
import type { CLIConfig } from "./types.js";

const TEST_CONFIG_DIR = join(tmpdir(), "papyrus-cli-test-" + Date.now());

describe("config", () => {
  beforeEach(() => {
    // Ensure test directory exists
    if (!existsSync(TEST_CONFIG_DIR)) {
      mkdirSync(TEST_CONFIG_DIR, { recursive: true });
    }
  });

  afterEach(() => {
    // Cleanup
    if (existsSync(TEST_CONFIG_DIR)) {
      rmSync(TEST_CONFIG_DIR, { recursive: true, force: true });
    }
  });

  describe("loadConfig", () => {
    it("should return default config if no config file exists", () => {
      const config = loadConfig();
      expect(config.apiUrl).toBe("http://127.0.0.1:8000");
      expect(config.dataDir).toBeTruthy();
    });
  });

  describe("getApiUrl", () => {
    it("should return the API URL", () => {
      const url = getApiUrl();
      expect(typeof url).toBe("string");
      expect(url).toContain("http");
    });
  });

  describe("getDataDir", () => {
    it("should return the data directory path", () => {
      const dir = getDataDir();
      expect(typeof dir).toBe("string");
    });
  });
});

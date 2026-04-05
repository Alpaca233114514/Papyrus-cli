/**
 * Papyrus CLI - Configuration Management
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";
import type { CLIConfig } from "./types.js";

const CONFIG_DIR = join(homedir(), ".papyrus");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

const DEFAULT_CONFIG: CLIConfig = {
  apiUrl: "http://127.0.0.1:8000",
  dataDir: join(homedir(), "Documents", "Papyrus"),
};

/**
 * Ensure config directory exists
 */
function ensureConfigDir(): void {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

/**
 * Load CLI configuration
 */
export function loadConfig(): CLIConfig {
  ensureConfigDir();

  if (!existsSync(CONFIG_FILE)) {
    saveConfig(DEFAULT_CONFIG);
    return { ...DEFAULT_CONFIG };
  }

  try {
    const data = readFileSync(CONFIG_FILE, "utf-8");
    const config = JSON.parse(data) as CLIConfig;
    return { ...DEFAULT_CONFIG, ...config };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Save CLI configuration
 */
export function saveConfig(config: CLIConfig): void {
  ensureConfigDir();
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf-8");
}

/**
 * Get configuration value
 */
export function getConfig<K extends keyof CLIConfig>(key: K): CLIConfig[K] {
  const config = loadConfig();
  return config[key];
}

/**
 * Set configuration value
 */
export function setConfig<K extends keyof CLIConfig>(key: K, value: CLIConfig[K]): void {
  const config = loadConfig();
  config[key] = value;
  saveConfig(config);
}

/**
 * Reset configuration to defaults
 */
export function resetConfig(): void {
  saveConfig(DEFAULT_CONFIG);
}

/**
 * Get data directory path
 */
export function getDataDir(): string {
  const config = loadConfig();
  if (!existsSync(config.dataDir)) {
    mkdirSync(config.dataDir, { recursive: true });
  }
  return config.dataDir;
}

/**
 * Get API URL
 */
export function getApiUrl(): string {
  const config = loadConfig();
  return config.apiUrl;
}

/**
 * Display current configuration
 */
export function displayConfig(): void {
  const config = loadConfig();
  console.log("Current Configuration:");
  console.log(`  API URL: ${config.apiUrl}`);
  console.log(`  Data Directory: ${config.dataDir}`);
  console.log(`  Config File: ${CONFIG_FILE}`);
}

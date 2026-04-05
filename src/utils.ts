/**
 * Papyrus CLI - Utility Functions
 */

import { existsSync, readFileSync, statSync } from "fs";
import { resolve } from "path";

/**
 * Format date for display
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString();
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now() / 1000;
  const diff = timestamp - now;

  if (diff < 0) {
    const absDiff = Math.abs(diff);
    if (absDiff < 60) {
      return "just now";
    }
    if (absDiff < 3600) {
      return `${Math.floor(absDiff / 60)} minutes ago`;
    }
    if (absDiff < 86400) {
      return `${Math.floor(absDiff / 3600)} hours ago`;
    }
    if (absDiff < 604800) {
      return `${Math.floor(absDiff / 86400)} days ago`;
    }
    return formatDate(timestamp);
  }

  if (diff < 60) {
    return "in a few seconds";
  }
  if (diff < 3600) {
    return `in ${Math.floor(diff / 60)} minutes`;
  }
  if (diff < 86400) {
    return `in ${Math.floor(diff / 3600)} hours`;
  }
  if (diff < 604800) {
    return `in ${Math.floor(diff / 86400)} days`;
  }
  return formatDate(timestamp);
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + "...";
}

/**
 * Read file content safely
 */
export function readFileSafe(path: string): string | null {
  try {
    const resolved = resolve(path);
    if (!existsSync(resolved)) {
      return null;
    }
    return readFileSync(resolved, "utf-8");
  } catch {
    return null;
  }
}

/**
 * Check if file exists and is readable
 */
export function isReadableFile(path: string): boolean {
  try {
    const resolved = resolve(path);
    if (!existsSync(resolved)) {
      return false;
    }
    const stats = statSync(resolved);
    return stats.isFile();
  } catch {
    return false;
  }
}

/**
 * Parse tags from comma-separated string
 */
export function parseTags(tagsStr: string | undefined): string[] {
  if (!tagsStr) {
    return [];
  }
  return tagsStr
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Validate card ID format
 */
export function isValidCardId(id: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

/**
 * Escape special regex characters
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Sleep for a given duration
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Prompt for user input (basic implementation)
 */
export async function prompt(question: string): Promise<string> {
  const { createInterface } = await import("readline");
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Confirm action with user
 */
export async function confirm(question: string): Promise<boolean> {
  const answer = await prompt(`${question} (y/N): `);
  return answer.toLowerCase() === "y" || answer.toLowerCase() === "yes";
}

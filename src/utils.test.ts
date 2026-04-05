import { describe, expect, it } from "@jest/globals";
import {
  formatDate,
  formatRelativeTime,
  truncate,
  parseTags,
  formatFileSize,
  isValidCardId,
} from "./utils.js";

describe("utils", () => {
  describe("formatDate", () => {
    it("should format timestamp to locale string", () => {
      const result = formatDate(1609459200); // 2021-01-01 00:00:00 UTC
      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });
  });

  describe("formatRelativeTime", () => {
    it("should show 'just now' for recent past", () => {
      const now = Date.now() / 1000;
      expect(formatRelativeTime(now - 30)).toContain("just now");
    });

    it("should show 'in X minutes' for near future", () => {
      const now = Date.now() / 1000;
      const result = formatRelativeTime(now + 120);
      expect(result).toContain("in");
    });
  });

  describe("truncate", () => {
    it("should not truncate short text", () => {
      expect(truncate("hello", 10)).toBe("hello");
    });

    it("should truncate long text with ellipsis", () => {
      const long = "this is a very long string";
      expect(truncate(long, 10)).toBe("this is...");
    });
  });

  describe("parseTags", () => {
    it("should return empty array for undefined", () => {
      expect(parseTags(undefined)).toEqual([]);
    });

    it("should parse comma-separated tags", () => {
      expect(parseTags("a, b, c")).toEqual(["a", "b", "c"]);
    });

    it("should trim whitespace", () => {
      expect(parseTags("  tag1  ,  tag2  ")).toEqual(["tag1", "tag2"]);
    });
  });

  describe("formatFileSize", () => {
    it("should format bytes", () => {
      expect(formatFileSize(512)).toBe("512 B");
    });

    it("should format kilobytes", () => {
      expect(formatFileSize(1536)).toBe("1.5 KB");
    });

    it("should format megabytes", () => {
      expect(formatFileSize(1572864)).toBe("1.5 MB");
    });
  });

  describe("isValidCardId", () => {
    it("should accept valid IDs", () => {
      expect(isValidCardId("abc123")).toBe(true);
      expect(isValidCardId("my-card_id")).toBe(true);
    });

    it("should reject invalid IDs", () => {
      expect(isValidCardId("")).toBe(false);
      expect(isValidCardId("hello world")).toBe(false);
      expect(isValidCardId("special!@#")).toBe(false);
    });
  });
});

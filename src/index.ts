/**
 * Papyrus CLI - Library Exports
 *
 * This file exports the API client and types for programmatic use.
 */

// API Client
export {
  healthCheck,
  isApiAvailable,
  listCards,
  getCard,
  createCard,
  updateCard,
  deleteCard,
  importCards,
  getReviewQueue,
  getReviewStats,
  submitReview,
  searchCards,
  exportData,
  importData,
  createBackup,
} from "./api.js";

// Configuration
export {
  loadConfig,
  saveConfig,
  getConfig,
  setConfig,
  resetConfig,
  getDataDir,
  getApiUrl,
  displayConfig,
} from "./config.js";

// Types
export type {
  Card,
  CreateCardInput,
  UpdateCardInput,
  CardsListResponse,
  CardResponse,
  DeleteResponse,
  ImportResponse,
  ReviewQueueItem,
  ReviewStats,
  ReviewStatsResponse,
  ReviewSubmission,
  ReviewSubmitResponse,
  HealthResponse,
  CLIConfig,
  BackupInfo,
  SearchResult,
  SearchResponse,
  Note,
  APIError,
} from "./types.js";

// Utilities
export {
  formatDate,
  formatRelativeTime,
  truncate,
  readFileSafe,
  isReadableFile,
  parseTags,
  formatFileSize,
  isValidCardId,
  escapeRegex,
  sleep,
  prompt,
  confirm,
} from "./utils.js";

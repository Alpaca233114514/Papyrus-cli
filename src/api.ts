/**
 * Papyrus CLI - API Client
 */

import axios, { AxiosError, type AxiosInstance } from "axios";
import { getApiUrl } from "./config.js";
import type {
  Card,
  CardResponse,
  CardsListResponse,
  CreateCardInput,
  DeleteResponse,
  HealthResponse,
  ImportResponse,
  ReviewStatsResponse,
  ReviewSubmitResponse,
  SearchResponse,
  UpdateCardInput,
} from "./types.js";

/**
 * Create configured Axios instance
 */
function createClient(): AxiosInstance {
  return axios.create({
    baseURL: getApiUrl(),
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Handle API errors
 */
function handleError(error: unknown): never {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.detail || 
                   error.response?.data?.message || 
                   error.message;
    const status = error.response?.status;
    
    if (status === 404) {
      throw new Error(`Not found: ${message}`);
    } else if (status === 400) {
      throw new Error(`Bad request: ${message}`);
    } else if (status === 500) {
      throw new Error(`Server error: ${message}`);
    } else if (error.code === "ECONNREFUSED") {
      throw new Error(
        "Cannot connect to Papyrus API. " +
        "Make sure the server is running with: papyrus serve"
      );
    }
    
    throw new Error(`API error: ${message}`);
  }
  
  throw error;
}

/**
 * Health check
 */
export async function healthCheck(): Promise<HealthResponse> {
  const client = createClient();
  try {
    const response = await client.get<HealthResponse>("/api/health");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Check if API is available
 */
export async function isApiAvailable(): Promise<boolean> {
  try {
    await healthCheck();
    return true;
  } catch {
    return false;
  }
}

// ==================== Card APIs ====================

/**
 * List all cards
 */
export async function listCards(): Promise<Card[]> {
  const client = createClient();
  try {
    const response = await client.get<CardsListResponse>("/api/cards");
    return response.data.cards;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Get a single card by ID
 */
export async function getCard(id: string): Promise<Card> {
  const client = createClient();
  try {
    const cards = await listCards();
    const card = cards.find(c => c.id === id);
    if (!card) {
      throw new Error(`Card not found: ${id}`);
    }
    return card;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Create a new card
 */
export async function createCard(input: CreateCardInput): Promise<Card> {
  const client = createClient();
  try {
    const response = await client.post<CardResponse>("/api/cards", input);
    return response.data.card;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Update a card
 */
export async function updateCard(id: string, input: UpdateCardInput): Promise<Card> {
  const client = createClient();
  try {
    const response = await client.patch<CardResponse>(`/api/cards/${id}`, input);
    return response.data.card;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Delete a card
 */
export async function deleteCard(id: string): Promise<void> {
  const client = createClient();
  try {
    await client.delete<DeleteResponse>(`/api/cards/${id}`);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Import cards from text
 */
export async function importCards(content: string): Promise<number> {
  const client = createClient();
  try {
    const response = await client.post<ImportResponse>("/api/cards/import/txt", {
      content,
    });
    return response.data.count;
  } catch (error) {
    return handleError(error);
  }
}

// ==================== Review APIs ====================

/**
 * Get next due card (single card review mode)
 */
export async function getNextDue(): Promise<{ card: Card | null; dueCount: number; totalCount: number }> {
  const client = createClient();
  try {
    const response = await client.get<{
      success: boolean;
      card: Card | null;
      due_count: number;
      total_count: number;
    }>("/api/review/next");
    return {
      card: response.data.card,
      dueCount: response.data.due_count,
      totalCount: response.data.total_count,
    };
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Get review queue (all due cards)
 */
export async function getReviewQueue(): Promise<Card[]> {
  // Get all cards and filter for due ones
  const cards = await listCards();
  const now = Date.now() / 1000;
  return cards.filter(c => c.next_review <= now);
}

/**
 * Get review stats
 */
export async function getReviewStats(): Promise<ReviewStatsResponse> {
  const cards = await listCards();
  const now = Date.now() / 1000;
  const dueCards = cards.filter(c => c.next_review <= now);
  
  return {
    success: true,
    stats: {
      total_cards: cards.length,
      due_today: dueCards.length,
      new_cards: cards.filter(c => c.repetitions === 0).length,
      review_cards: dueCards.filter(c => c.repetitions > 0).length,
    },
  };
}

/**
 * Submit review
 */
export async function submitReview(cardId: string, grade: number): Promise<void> {
  const client = createClient();
  try {
    await client.post(`/api/review/${cardId}/rate`, { grade });
  } catch (error) {
    return handleError(error);
  }
}

// ==================== Search APIs ====================

/**
 * Search result item from API
 */
interface SearchResultItem {
  id: string;
  type: "note" | "card";
  title: string;
  preview: string;
  folder: string;
  tags: string[];
  matched_field: string;
  updated_at?: number;
}

/**
 * Search API response
 */
interface SearchAPIResponse {
  success: boolean;
  query: string;
  results: SearchResultItem[];
  total: number;
  notes_count: number;
  cards_count: number;
}

/**
 * Search cards
 */
export async function searchCards(query: string): Promise<SearchResponse> {
  const client = createClient();
  try {
    const response = await client.get<SearchAPIResponse>("/api/search", {
      params: { query },
    });
    
    // Map API response to CLI format
    const cardResults = response.data.results
      .filter(r => r.type === "card")
      .map(r => ({
        card: {
          id: r.id,
          q: r.title,
          a: r.preview,
          next_review: 0,
          interval: 0,
          ef: 2.5,
          repetitions: 0,
          tags: r.tags,
        } as Card,
        score: 1.0,
      }));
    
    return {
      success: true,
      results: cardResults,
      count: cardResults.length,
    };
  } catch (error) {
    return handleError(error);
  }
}

// ==================== Data APIs ====================

/**
 * Export data
 */
export async function exportData(): Promise<unknown> {
  const client = createClient();
  try {
    const response = await client.get<unknown>("/api/data/export");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Import data
 */
export async function importData(data: unknown): Promise<void> {
  const client = createClient();
  try {
    await client.post("/api/data/import", data);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * Create backup
 */
export async function createBackup(): Promise<{ path: string }> {
  const client = createClient();
  try {
    const response = await client.post<{ path: string }>("/api/data/backup");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
}

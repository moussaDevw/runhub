/**
 * API Client — Centralized HTTP fetcher for RunHub.
 *
 * All API modules should use `apiClient` instead of calling `fetch` directly.
 * This keeps base URL, headers, auth tokens, and error handling in one place.
 */
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { TokenStorage } from './token-storage';

/**
 * Détecte automatiquement l'URL de l'API en développement (particulièrement utile pour Expo Go sur vrai téléphone).
 */
function getBaseUrl(): string {
  // 1. Priorité à la variable d'environnement explicite si définie dans .env
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (__DEV__) {
    // 2. Si on tourne dans Expo Go sur un vrai téléphone, on récupère l'adresse IP locale du PC (ex: 192.168.1.XX)
    const hostUri = Constants.expoConfig?.hostUri;
    if (hostUri) {
      const ip = hostUri.split(':')[0];
      return `http://${ip}:3000/api`;
    }

    // 3. Fallback standard : émulateur Android (10.0.2.2) ou simulateur iOS / Web (localhost)
    return Platform.OS === 'android' ? 'http://10.0.2.2:3000/api' : 'http://localhost:3000/api';
  }

  // Production
  return 'https://api.runhub.sn/api';
}

export const BASE_URL = getBaseUrl();

/** Typed API error with status code and server message */
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body?: unknown,
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

interface ApiClientOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Override the base URL for this request */
  baseUrl?: string;
  /** Skip injecting the Auth token (e.g., for login/register endpoints) */
  skipAuth?: boolean;
}

/**
 * Makes an authenticated API request.
 * Automatically injects JWT Bearer token and unwraps NestJS `ApiResponse.success(data)`.
 */
export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { body, baseUrl, skipAuth, headers: customHeaders, ...fetchOptions } = options;

  const url = `${baseUrl ?? BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    Accept: 'application/json',
    ...customHeaders,
  };

  // Only set Content-Type for JSON bodies (not FormData)
  if (body && !(body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json';
  }

  // Inject auth token unless explicitly skipped
  if (!skipAuth) {
    const token = await TokenStorage.getAccessToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let errorBody: unknown;
    try {
      errorBody = await response.json();
    } catch {
      // Server didn't return JSON error body — that's fine
    }
    throw new ApiError(response.status, response.statusText, errorBody);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  const json = await response.json();

  // Unwrap NestJS backend ApiResponse { success: true, data: T, message: string }
  if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
    return json.data as T;
  }

  return json as T;
}

/**
 * API Client — Centralized HTTP fetcher for RunHub.
 *
 * All API modules should use `apiClient` instead of calling `fetch` directly.
 * This keeps base URL, headers, auth tokens, and error handling in one place.
 *
 * ## Refresh flow
 * When the server responds with 401, the client:
 *   1. Tries to get a new access token using the stored refresh token.
 *   2. Retries the original request once with the new token.
 *   3. If the refresh itself fails, calls `onUnauthenticated()` to trigger logout.
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
    // Attempt to extract the backend's detailed error message
    let detailedMessage = `API Error ${status}: ${statusText}`;
    if (body && typeof body === 'object') {
      const b = body as Record<string, any>;
      // NestJS often puts validation messages in an array or string under "message"
      if (b.message) {
        const errorDetails = Array.isArray(b.message) ? b.message.join(', ') : b.message;
        detailedMessage += ` - ${errorDetails}`;
      }
    }

    super(detailedMessage);
    this.name = 'ApiError';
  }
}

interface ApiClientOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  /** Override the base URL for this request */
  baseUrl?: string;
  /** Skip injecting the Auth token (e.g., for login/register endpoints) */
  skipAuth?: boolean;
  /** Internal flag — prevents infinite retry loop on refresh failure */
  _isRetry?: boolean;
}

// ---------------------------------------------------------------------------
// Refresh token logic
// ---------------------------------------------------------------------------

/** Prevents multiple simultaneous refresh calls */
let isRefreshing = false;
/** Queue of resolve/reject callbacks waiting for the refresh to complete */
let refreshQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

/**
 * Global callback triggered when authentication cannot be recovered.
 * Set this from AuthContext so the client can call logout() automatically.
 */
let onUnauthenticated: (() => void) | null = null;

export function setOnUnauthenticated(callback: () => void) {
  onUnauthenticated = callback;
}

/**
 * Attempts to get a fresh access token using the stored refresh token.
 * Deduplicates concurrent calls so only one refresh request is made at a time.
 */
async function refreshAccessToken(): Promise<string> {
  if (isRefreshing) {
    // Another refresh is already in progress — queue this caller
    return new Promise<string>((resolve, reject) => {
      refreshQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    const refreshToken = await TokenStorage.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    const json = await response.json();
    const newAccessToken: string = json.accessToken ?? json.access_token ?? json.token ?? json.data?.accessToken;

    if (!newAccessToken) throw new Error('Refresh response did not contain an access token');

    await TokenStorage.setAccessToken(newAccessToken);

    // Resolve all queued callers with the new token
    refreshQueue.forEach(({ resolve }) => resolve(newAccessToken));
    return newAccessToken;
  } catch (err) {
    // Reject all queued callers
    refreshQueue.forEach(({ reject }) => reject(err));
    throw err;
  } finally {
    isRefreshing = false;
    refreshQueue = [];
  }
}

// ---------------------------------------------------------------------------
// Core client
// ---------------------------------------------------------------------------

/**
 * Makes an authenticated API request.
 * Automatically injects JWT Bearer token and unwraps NestJS `ApiResponse.success(data)`.
 * On 401, attempts a token refresh and retries the request once.
 */
export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { body, baseUrl, skipAuth, _isRetry = false, headers: customHeaders, ...fetchOptions } = options;

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

  // --- 401 Handling: try refresh + retry once ---
  if (response.status === 401 && !skipAuth && !_isRetry) {
    try {
      await refreshAccessToken();
      // Retry the original request with the new token (marked as retry to prevent loop)
      return apiClient<T>(endpoint, { ...options, _isRetry: true });
    } catch {
      // Refresh failed — session is invalid, trigger logout
      onUnauthenticated?.();
      throw new ApiError(401, 'Unauthorized — session expired');
    }
  }

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


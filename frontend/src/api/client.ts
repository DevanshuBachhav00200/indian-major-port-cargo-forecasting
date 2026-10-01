/**
 * Centralized API Client helper for Frontend Application
 * Resolves API endpoint URLs dynamically using VITE_API_BASE_URL environment variable.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL !== undefined
  ? import.meta.env.VITE_API_BASE_URL
  : '/api';

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!BASE_URL) {
    return cleanEndpoint;
  }
  // Remove trailing slash from base if present
  const cleanBase = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  return `${cleanBase}${cleanEndpoint}`;
};

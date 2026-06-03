/**
 * Pre-configured axios instance with HTTP method validation.
 *
 * Adds a request interceptor that rejects outgoing requests whose HTTP
 * method is not on the explicit allow-list. This prevents accidental or
 * injected use of destructive methods (DELETE, PATCH) on endpoints that
 * are only intended to accept read or create operations.
 */
import axios, { InternalAxiosRequestConfig } from 'axios';

const ALLOWED_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options']);

const apiClient = axios.create();

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const method = (config.method || '').toLowerCase();

  if (!ALLOWED_METHODS.has(method)) {
    return Promise.reject(
      new Error(`HTTP method '${config.method}' is not permitted`)
    ) as unknown as InternalAxiosRequestConfig;
  }

  // Reject DELETE requests to read-only data endpoints.
  // The /api/repos endpoint is a read-only listing; a DELETE request to it
  // should never be sent from the client.
  if (method === 'delete' && config.url?.includes('/api/repos')) {
    return Promise.reject(
      new Error("DELETE is not allowed on the /api/repos endpoint")
    ) as unknown as InternalAxiosRequestConfig;
  }

  return config;
});

export default apiClient;

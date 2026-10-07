/**
 * API response types
 */

export interface HealthResponse {
  status: string;
  message?: string;
}

export interface ApiErrorResponse {
  error: string;
  message?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

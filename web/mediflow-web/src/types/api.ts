export interface ApiErrorResponse {
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

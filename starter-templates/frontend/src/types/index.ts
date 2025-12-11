export interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

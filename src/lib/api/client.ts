const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface ApiResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export async function fetchApi<T>(endpoint: string): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  return response.json();
} 
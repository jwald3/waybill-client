export const API_BASE_URL = '/api/v1';

export interface ApiResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export async function fetchApi<T>(
  endpoint: string,
  fetchFn: typeof fetch = fetch
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetchFn(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
} 
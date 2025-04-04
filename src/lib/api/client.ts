export const API_BASE_URL = typeof window !== 'undefined' 
  ? '/api/v1'  // Client-side requests through proxy
  : 'http://localhost:8000/api/v1';  // Direct server-side requests

export interface ApiResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

export async function fetchApi<T>(
  endpoint: string,
  fetchFn: typeof fetch = fetch,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const response = await fetchFn(url, {
      ...options,
      headers
    });

    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      console.error(`API call failed for ${url}:`, response.status, response.statusText);
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

// Helper for POST/PUT/DELETE requests
export async function mutateApi<T>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH',
  data?: unknown,
  fetchFn: typeof fetch = fetch
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };

  const response = await fetchFn(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
    throw new Error('Authentication required');
  }

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

// Specific API functions for analytics data
export async function getTrips(fetchFn: typeof fetch = fetch) {
  return fetchApi('/trips', fetchFn);
}

export async function getTrucks(fetchFn: typeof fetch = fetch) {
  return fetchApi('/trucks', fetchFn);
}

export async function getIncidents(fetchFn: typeof fetch = fetch) {
  return fetchApi('/incidents', fetchFn);
}

export async function getMaintenanceLogs(fetchFn: typeof fetch = fetch) {
  return fetchApi('/maintenance', fetchFn);
} 
// export const API_BASE_URL = '/api/v1'; 
export const API_BASE_URL = 'http://localhost:8000/api/v1';  // Remove the conditional, always use the proxy path

export interface ApiResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface SingleItemResponse<T> {
  data: T;
}

function getAuthToken(): string | null {
  // If we're client-side, use localStorage
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  
  // If we're server-side, return null to let hooks.server.ts handle auth
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

  try {
    const response = await fetchFn(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined
    });

    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error in mutateApi for ${url}:`, error);
    throw error;
  }
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

export async function fetchSingleItem<T>(
  endpoint: string,
  fetchFn: typeof fetch = fetch,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  try {
    const response = await fetchFn(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: SingleItemResponse<T> = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
} 
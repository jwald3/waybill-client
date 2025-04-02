import { fetchApi, type ApiResponse, API_BASE_URL, mutateApi } from './client';
import type { Truck } from './trucks';

export interface MaintenanceLog {
  id: string;
  truck: Truck;
  date: string;
  service_type: 'ROUTINE_MAINTENANCE' | 'REPAIR' | 'EMERGENCY';
  cost: number;
  notes: string;
  mechanic: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMaintenanceLogPayload {
  truck_id: string;
  date: string;
  service_type: 'ROUTINE_MAINTENANCE' | 'REPAIR' | 'EMERGENCY';
  cost: number;
  notes: string;
  mechanic: string;
  location: string;
}

export async function getMaintenanceLog(id: string, fetchFn: typeof fetch = fetch): Promise<MaintenanceLog> {
  const url = `${API_BASE_URL}/maintenance-logs/${id}`;
  
  try {
    const response = await fetchFn(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    
    if (!responseData.data) {
      console.error('Unexpected response format:', responseData);
      throw new Error('Invalid response format from API');
    }
    
    return responseData.data;
  } catch (err) {
    console.error('Error fetching maintenance log:', err);
    throw err;
  }
}

export async function getMaintenanceLogs(fetchFn: typeof fetch = fetch): Promise<ApiResponse<MaintenanceLog>> {
  return fetchApi<MaintenanceLog>('/maintenance-logs', fetchFn);
}

export async function createMaintenanceLog(
  payload: CreateMaintenanceLogPayload, 
  fetchFn: typeof fetch = fetch
): Promise<MaintenanceLog> {
  try {
    return await mutateApi<MaintenanceLog>('/maintenance-logs', 'POST', payload, fetchFn);
  } catch (err) {
    console.error('Error creating maintenance log:', err);
    throw err;
  }
} 
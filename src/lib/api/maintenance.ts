import { fetchApi, type ApiResponse, fetchSingleItem, mutateApi } from './client';
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
  try {
    const response = await fetchSingleItem<MaintenanceLog>(`/maintenance-logs/${id}`, fetchFn);

    return response;
  } catch (err) {
    console.error('[getDriver] Error details:', {
      error: err,
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined
    });
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
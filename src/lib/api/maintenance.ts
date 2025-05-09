import { fetchApi, type ApiResponse, fetchSingleItem, mutateApi } from './client';
import type { Truck } from './trucks';
import type { MaintenanceServiceType } from '$lib/types/maintenance';

export interface MaintenanceLog {
  id: string;
  truck: Truck;
  date: string;
  service_type: MaintenanceServiceType;
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
  service_type: MaintenanceServiceType;
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

export async function getMaintenanceLogs(
  fetchFn: typeof fetch = fetch,
  truckId?: string
): Promise<ApiResponse<MaintenanceLog>> {
  const endpoint = truckId 
    ? `/maintenance-logs?truckID=${truckId}`
    : '/maintenance-logs';
  return fetchApi<MaintenanceLog>(endpoint, fetchFn);
}

export async function createMaintenanceLog(
  payload: CreateMaintenanceLogPayload, 
  fetchFn: typeof fetch = fetch
): Promise<MaintenanceLog> {
  try {
    return await mutateApi<MaintenanceLog>('/maintenance-logs', 'POST', payload, fetchFn);
  } catch (err) {
    console.error('Error creating maintenance log:', err);

    console.log(payload);


    throw err;
  }
} 
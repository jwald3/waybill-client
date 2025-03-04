import { fetchApi, type ApiResponse, API_BASE_URL } from './client';
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

interface MaintenanceLogResponse {
  data: MaintenanceLog;
}

export async function getMaintenanceLog(id: string): Promise<MaintenanceLog> {
  const response = await fetch(`${API_BASE_URL}/maintenance-logs/${id}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  const result: MaintenanceLogResponse = await response.json();
  return result.data;
}

export async function getMaintenanceLogs(): Promise<ApiResponse<MaintenanceLog>> {
  return fetchApi<MaintenanceLog>('/maintenance-logs');
} 
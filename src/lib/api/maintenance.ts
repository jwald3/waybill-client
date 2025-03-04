import { fetchApi } from './client';
import type { ApiResponse } from './client';
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

export async function getMaintenanceLogs(): Promise<ApiResponse<MaintenanceLog>> {
  return fetchApi<MaintenanceLog>('/maintenance-logs');
} 
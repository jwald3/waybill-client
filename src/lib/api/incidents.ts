import { fetchApi } from './client';
import type { ApiResponse } from './client';
import type { Trip } from './trips';
import type { Truck } from './trucks';
import type { Driver } from './drivers';

export interface IncidentReport {
  id: string;
  trip: Trip;
  truck: Truck;
  driver: Driver;
  type: 'TRAFFIC_ACCIDENT' | 'MECHANICAL_FAILURE' | 'WEATHER_DELAY' | 'CARGO_ISSUE' | 'OTHER';
  description: string;
  date: string;
  location: string;
  damage_estimate: number;
  created_at: string;
  updated_at: string;
}

export async function getIncidents(): Promise<ApiResponse<IncidentReport>> {
  return fetchApi<IncidentReport>('/incident-reports');
} 
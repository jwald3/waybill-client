import { fetchApi, type ApiResponse, mutateApi, fetchSingleItem } from './client';
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


export async function getIncidents(fetchFn: typeof fetch = fetch): Promise<ApiResponse<IncidentReport>> {
  return fetchApi<IncidentReport>('/incident-reports', fetchFn);
}

export async function getIncident(id: string, fetchFn: typeof fetch = fetch): Promise<IncidentReport> {
  try {
    const response = await fetchSingleItem<IncidentReport>(`/incident-reports/${id}`, fetchFn);

    return response;
  } catch (err) {
      console.error('[getIncident] Error details:', {
      error: err,
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined
    });
    throw err;
  }
}

export interface CreateIncidentPayload {
  trip_id: string;
  truck_id: string;
  driver_id: string;
  type: 'TRAFFIC_ACCIDENT' | 'MECHANICAL_FAILURE' | 'WEATHER_DELAY' | 'CARGO_ISSUE' | 'OTHER';
  description: string;
  date: string;
  location: string;
  damage_estimate: number;
}

export async function createIncident(
  incident: CreateIncidentPayload, 
  fetchFn: typeof fetch = fetch
): Promise<IncidentReport> {
  try {
    return await mutateApi<IncidentReport>('/incident-reports', 'POST', incident, fetchFn);
  } catch (err) {
    console.error('Error creating incident:', err);
    throw err;
  }
} 
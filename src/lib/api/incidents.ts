import { fetchApi, type ApiResponse, API_BASE_URL } from './client';
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

interface SingleIncidentResponse {
  data: IncidentReport;
}

export async function getIncidents(fetchFn: typeof fetch = fetch): Promise<ApiResponse<IncidentReport>> {
  return fetchApi<IncidentReport>('/incident-reports', fetchFn);
}

export async function getIncident(id: string, fetchFn: typeof fetch = fetch): Promise<IncidentReport> {
  try {
    const response = await fetchFn(`${API_BASE_URL}/incident-reports/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data: SingleIncidentResponse = await response.json();
    if (!data?.data) {
      throw new Error('Incident not found');
    }

    return data.data;
  } catch (err) {
    console.error('Error fetching incident:', err);
    throw new Error(err instanceof Error ? err.message : 'Failed to load incident');
  }
} 
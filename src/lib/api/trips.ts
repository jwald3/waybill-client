import { fetchApi, type ApiResponse } from './client';

export interface TripNote {
  note_timestamp: string;
  content: string;
}

export interface Trip {
  id: string;
  trip_number: string;
  departure_time: {
    scheduled: string;
    actual?: string;
  };
  arrival_time: {
    scheduled: string;
    actual?: string;
  };
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
  cargo: {
    description: string;
    weight: number;
    hazmat: boolean;
  };
  fuel_usage_gallons: number;
  distance_miles: number;
  notes: TripNote[];
  created_at: string;
  updated_at: string;
}

export async function getTrips(fetchFn: typeof fetch = fetch): Promise<ApiResponse<Trip>> {
  return fetchApi<Trip>('/trips', fetchFn);
}

export async function getTrip(id: string, fetchFn: typeof fetch = fetch): Promise<Trip> {
  const response = await fetchApi<Trip>(`/trips/${id}`, fetchFn);
  return response.items[0];
} 
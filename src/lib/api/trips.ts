import { fetchApi, type ApiResponse, API_BASE_URL } from './client';

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

interface TripResponse {
  data: Trip;
}

export async function getTrip(id: string): Promise<Trip> {
  const response = await fetch(`${API_BASE_URL}/trips/${id}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  const result: TripResponse = await response.json();
  return result.data;
}

export async function getTrips(): Promise<ApiResponse<Trip>> {
  return fetchApi<Trip>('/trips');
} 
import { fetchApi, type ApiResponse, fetchSingleItem, mutateApi } from './client';

export interface TripNote {
  note_timestamp: string;
  content: string;
}

export interface Trip {
  id: string;
  trip_number: string;
  driver_id: string;
  driver: {
    id: string;
    first_name: string;
    last_name: string;
    employee_number: string;
  };
  truck_id: string;
  truck: {
    id: string;
    unit_number: string;
    make: string;
    model: string;
  };
  start_facility_id: string;
  start_facility: {
    id: string;
    name: string;
    address: {
      city: string;
      state: string;
    };
  };
  end_facility_id: string;
  end_facility: {
    id: string;
    name: string;
    address: {
      city: string;
      state: string;
    };
  };
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

export interface AddTripNoteRequest {
  content: string;
}

export type TripStatus = 'SCHEDULED' | 'IN_TRANSIT' | 'COMPLETED' | 'FAILED_DELIVERY' | 'CANCELED';

interface BeginTripRequest {
  departure_time: string;
}

interface FinishTripRequest {
  arrival_time: string;
}

export async function getTrips(fetchFn: typeof fetch = fetch): Promise<ApiResponse<Trip>> {
  return fetchApi<Trip>('/trips', fetchFn);
}

export async function getTrip(id: string, fetchFn: typeof fetch = fetch): Promise<Trip> {
  try {
    const response = await fetchSingleItem<Trip>(`/trips/${id}`, fetchFn);
    return response;
  } catch (err) {
    console.error('[getTrip] Error details:', {
      error: err,
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined
    });
    throw err;
  }
}

export async function addTripNote(
  tripId: string, 
  note: AddTripNoteRequest, 
  fetchFn: typeof fetch = fetch
): Promise<Trip> {
  try {
    return await mutateApi<Trip>(`/trips/${tripId}/notes`, 'POST', note, fetchFn);
  } catch (err) {
    console.error('Error adding trip note:', err);
    throw err;
  }
}

export async function beginTrip(
  tripId: string, 
  data: BeginTripRequest,
  fetchFn: typeof fetch = fetch
): Promise<Trip> {
  try {
    return await mutateApi<Trip>(`/trips/${tripId}/begin`, 'PATCH', data, fetchFn);
  } catch (err) {
    throw new Error(`Failed to begin trip: ${err}`);
  }
}

export async function finishTripSuccess(
  tripId: string,
  data: FinishTripRequest,
  fetchFn: typeof fetch = fetch
): Promise<Trip> {
  try {
    return await mutateApi<Trip>(`/trips/${tripId}/finish/success`, 'PATCH', data, fetchFn);
  } catch (err) {
    throw new Error(`Failed to complete trip: ${err}`);
  }
}

export async function finishTripFailure(
  tripId: string,
  data: FinishTripRequest,
  fetchFn: typeof fetch = fetch
): Promise<Trip> {
  try {
    return await mutateApi<Trip>(`/trips/${tripId}/finish/failure`, 'PATCH', data, fetchFn);
  } catch (err) {
    throw new Error(`Failed to mark trip as failed: ${err}`);
  }
}

export async function cancelTrip(
  tripId: string,
  fetchFn: typeof fetch = fetch
): Promise<Trip> {
  try {
    return await mutateApi<Trip>(`/trips/${tripId}/cancel`, 'PATCH', undefined, fetchFn);
  } catch (err) {
    throw new Error(`Failed to cancel trip: ${err}`);
  }
} 
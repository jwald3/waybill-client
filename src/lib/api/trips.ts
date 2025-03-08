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
  const url = `${API_BASE_URL}/trips/${id}`;
  
  try {
    const response = await fetchFn(url, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      // Try to get error details from response
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    
    if (!responseData.data) {
      console.error('Unexpected response format:', responseData);
      throw new Error('Invalid response format from API');
    }
    
    return responseData.data;
  } catch (err) {
    console.error('Error fetching trip:', err);
    throw err;
  }
}

export async function addTripNote(
  tripId: string, 
  note: AddTripNoteRequest, 
  fetchFn: typeof fetch = fetch
): Promise<Trip> {
  const url = `${API_BASE_URL}/trips/${tripId}/notes`;
  
  try {
    const response = await fetchFn(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(note)
    });

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData.data;
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
  const url = `${API_BASE_URL}/trips/${tripId}/begin`;
  
  const response = await fetchFn(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to begin trip: ${response.statusText}`);
  }

  return response.json().then(res => res.data);
}

export async function finishTripSuccess(
  tripId: string,
  data: FinishTripRequest,
  fetchFn: typeof fetch = fetch
): Promise<Trip> {
  const url = `${API_BASE_URL}/trips/${tripId}/finish/success`;
  
  const response = await fetchFn(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to complete trip: ${response.statusText}`);
  }

  return response.json().then(res => res.data);
}

export async function finishTripFailure(
  tripId: string,
  data: FinishTripRequest,
  fetchFn: typeof fetch = fetch
): Promise<Trip> {
  const url = `${API_BASE_URL}/trips/${tripId}/finish/failure`;
  
  const response = await fetchFn(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to mark trip as failed: ${response.statusText}`);
  }

  return response.json().then(res => res.data);
}

export async function cancelTrip(
  tripId: string,
  fetchFn: typeof fetch = fetch
): Promise<Trip> {
  const url = `${API_BASE_URL}/trips/${tripId}/cancel`;
  
  const response = await fetchFn(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to cancel trip: ${response.statusText}`);
  }

  return response.json().then(res => res.data);
} 
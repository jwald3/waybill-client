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
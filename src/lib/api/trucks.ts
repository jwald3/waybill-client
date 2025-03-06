import { fetchApi, type ApiResponse, API_BASE_URL } from './client';

export interface LicensePlate {
  number: string;
  state: string;
}

export interface Truck {
  id: string;
  truck_number: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  license_plate: LicensePlate;
  mileage: number;
  status: 'IN_TRANSIT' | 'MAINTENANCE' | 'AVAILABLE';
  trailer_type: 'DRY_VAN' | 'REFRIGERATED' | 'FLATBED';
  capacity_tons: number;
  fuel_type: string;
  last_maintenance: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTruckPayload {
  truck_number: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  license_plate: LicensePlate;
  mileage: number;
  status: 'IN_TRANSIT' | 'MAINTENANCE' | 'AVAILABLE';
  trailer_type: 'DRY_VAN' | 'REFRIGERATED' | 'FLATBED';
  capacity_tons: number;
  fuel_type: string;
  last_maintenance: string;
}

export async function getTruck(id: string, fetchFn: typeof fetch = fetch): Promise<Truck> {
  const url = `${API_BASE_URL}/trucks/${id}`;
  console.log('Fetching truck from URL:', url);
  
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
      
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('API Response:', responseData);
    
    if (!responseData.data) {
      console.error('Unexpected response format:', responseData);
      throw new Error('Invalid response format from API');
    }
    
    return responseData.data;
  } catch (err) {
    console.error('Error fetching truck:', err);
    throw err;
  }
}

export async function createTruck(truck: CreateTruckPayload, fetchFn: typeof fetch = fetch): Promise<Truck> {
  const url = `${API_BASE_URL}/trucks`;
  console.log('Creating truck at URL:', url);
  
  try {
    const response = await fetchFn(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(truck)
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
    console.log('API Response:', responseData);
    
    if (!responseData.data) {
      console.error('Unexpected response format:', responseData);
      throw new Error('Invalid response format from API');
    }
    
    return responseData.data;
  } catch (err) {
    console.error('Error creating truck:', err);
    throw err;
  }
}

export async function getTrucks(fetchFn: typeof fetch = fetch): Promise<ApiResponse<Truck>> {
  return fetchApi<Truck>('/trucks', fetchFn);
} 
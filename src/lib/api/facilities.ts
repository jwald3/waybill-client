import { fetchApi, type ApiResponse, API_BASE_URL } from './client';

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
}

export interface Facility {
  id: string;
  facility_number: string;
  name: string;
  type: string;
  address: Address;
  contact_info: ContactInfo;
  parking_capacity: number;
  services_available: string[];
  created_at: string;
  updated_at: string;
}

interface FacilityResponse {
  data: Facility;
}

interface SingleFacilityResponse {
  data: Facility;
}

export async function getFacility(id: string, fetchFn: typeof fetch = fetch): Promise<Facility> {
  const url = `${API_BASE_URL}/facilities/${id}`;
  console.log('Fetching facility from URL:', url);
  
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
    console.error('Error fetching facility:', err);
    throw err;
  }
}

export async function getFacilities(fetchFn: typeof fetch = fetch): Promise<ApiResponse<Facility>> {
  return fetchApi<Facility>('/facilities', fetchFn);
} 
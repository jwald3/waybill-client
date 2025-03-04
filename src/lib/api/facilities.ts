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

export async function getFacility(id: string): Promise<Facility> {
  const response = await fetch(`${API_BASE_URL}/facilities/${id}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  const result: FacilityResponse = await response.json();
  return result.data;
}

export async function getFacilities(): Promise<ApiResponse<Facility>> {
  return fetchApi<Facility>('/facilities');
} 
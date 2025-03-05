import { fetchApi, type ApiResponse } from './client';

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

export async function getFacilities(fetchFn: typeof fetch = fetch): Promise<ApiResponse<Facility>> {
  return fetchApi<Facility>('/facilities', fetchFn);
}

export async function getFacility(id: string, fetchFn: typeof fetch = fetch): Promise<Facility> {
  const response = await fetchApi<Facility>(`/facilities/${id}`, fetchFn);
  return response.items[0];
} 
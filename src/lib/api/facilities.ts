import { fetchApi } from './client';
import type { ApiResponse } from './client';

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

export async function getFacilities(): Promise<ApiResponse<Facility>> {
  return fetchApi<Facility>('/facilities');
} 
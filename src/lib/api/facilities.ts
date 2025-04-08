import { fetchApi, type ApiResponse, fetchSingleItem, mutateApi } from './client';

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

export interface CreateFacilityPayload {
  facility_number: string;
  name: string;
  type: string;
  address: Address;
  contact_info: ContactInfo;
  parking_capacity: number;
  services_available: string[];
}

export async function getFacility(id: string, fetchFn: typeof fetch = fetch): Promise<Facility> {
  try {
    const response = await fetchSingleItem<Facility>(`/facilities/${id}`, fetchFn);

    return response;
  } catch (err) {
    console.error('[getFacility] Error details:', {
      error: err,
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined
    });
    throw err;
  }
}

export async function getFacilities(fetchFn: typeof fetch = fetch): Promise<ApiResponse<Facility>> {
  return fetchApi<Facility>('/facilities', fetchFn);
}

export async function createFacility(
  facility: CreateFacilityPayload, 
  fetchFn: typeof fetch = fetch
): Promise<Facility> {
  try {
    return await mutateApi<Facility>('/facilities', 'POST', facility, fetchFn);
  } catch (err) {
    console.error('Error creating facility:', err);
    throw err;
  }
} 
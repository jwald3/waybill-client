import { fetchApi, type ApiResponse, API_BASE_URL } from './client';

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  dob: string;
  license_number: string;
  license_state: string;
  license_expiration: string;
  phone: string;
  email: string;
  address: Address;
  employment_status: 'ACTIVE' | 'SUSPENDED' | 'ON_LEAVE' | 'TERMINATED';
  created_at: string;
  updated_at: string;
}

export async function getDrivers(fetchFn: typeof fetch = fetch): Promise<ApiResponse<Driver>> {
  return fetchApi<Driver>('/drivers', fetchFn);
}

interface DriverResponse {
  data: Driver;
}

export async function getDriver(id: string, fetchFn: typeof fetch = fetch): Promise<Driver> {
  const response = await fetchFn(`${API_BASE_URL}/drivers/${id}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  const result: DriverResponse = await response.json();
  return result.data;
}

export interface CreateDriverPayload {
  first_name: string;
  last_name: string;
  dob: string;
  license_number: string;
  license_state: string;
  license_expiration: string;
  phone: string;
  email: string;
  address: Address;
}

export async function createDriver(driver: CreateDriverPayload): Promise<Driver> {
  const response = await fetch(`${API_BASE_URL}/drivers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(driver)
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const result: DriverResponse = await response.json();
  return result.data;
} 
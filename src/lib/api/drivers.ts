import { fetchApi, type ApiResponse, API_BASE_URL, mutateApi } from './client';

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
  employment_status: 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';
  created_at: string;
  updated_at: string;
}

export interface DriverResponse {
  data: Driver;
}

export async function getDrivers(fetchFn: typeof fetch = fetch): Promise<ApiResponse<Driver>> {
  return fetchApi<Driver>('/drivers', fetchFn);
}

export async function getDriver(id: string, fetchFn: typeof fetch = fetch): Promise<Driver> {
  const url = `${API_BASE_URL}/drivers/${id}`;
  
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
    
    if (!responseData.data) {
      console.error('Unexpected response format:', responseData);
      throw new Error('Invalid response format from API');
    }
    
    return responseData.data;
  } catch (err) {
    console.error('Error fetching driver:', err);
    throw err;
  }
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

export async function createDriver(
  driver: CreateDriverPayload, 
  fetchFn: typeof fetch = fetch
): Promise<Driver> {
  try {
    return await mutateApi<Driver>('/drivers', 'POST', driver, fetchFn);
  } catch (err) {
    console.error('Error creating driver:', err);
    throw err;
  }
}

export type EmploymentStatus = 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';

export interface UpdateEmploymentStatusPayload {
  employment_status: EmploymentStatus;
}

export async function activateDriver(
  driverId: string,
  fetchFn: typeof fetch = fetch
): Promise<Driver> {
  try {
    return await mutateApi<Driver>(`/drivers/${driverId}/employment-status/activate`, 'PATCH', undefined, fetchFn);
  } catch (err) {
    throw new Error(`Failed to activate driver: ${err}`);
  }
}

export async function suspendDriver(
  driverId: string,
  fetchFn: typeof fetch = fetch
): Promise<Driver> {
  try {
    return await mutateApi<Driver>(`/drivers/${driverId}/employment-status/suspend`, 'PATCH', undefined, fetchFn);
  } catch (err) {
    throw new Error(`Failed to suspend driver: ${err}`);
  }
}

export async function terminateDriver(
  driverId: string,
  fetchFn: typeof fetch = fetch
): Promise<Driver> {
  try {
    return await mutateApi<Driver>(`/drivers/${driverId}/employment-status/terminate`, 'PATCH', undefined, fetchFn);
  } catch (err) {
    throw new Error(`Failed to terminate driver: ${err}`);
  }
}

export function getAvailableStatusTransitions(currentStatus: EmploymentStatus): Array<{value: EmploymentStatus, label: string}> {
  switch (currentStatus) {
    case 'ACTIVE':
      return [
        { value: 'SUSPENDED', label: 'Suspend Driver' },
        { value: 'TERMINATED', label: 'Terminate Driver' }
      ];
    case 'SUSPENDED':
      return [
        { value: 'ACTIVE', label: 'Reactivate Driver' },
        { value: 'TERMINATED', label: 'Terminate Driver' }
      ];
    default:
      return [];
  }
} 
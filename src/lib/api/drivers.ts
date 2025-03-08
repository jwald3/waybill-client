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

export type EmploymentStatus = 'ACTIVE' | 'SUSPENDED' | 'TERMINATED';

export interface UpdateEmploymentStatusPayload {
  employment_status: EmploymentStatus;
}

export async function activateDriver(
  driverId: string,
  fetchFn: typeof fetch = fetch
): Promise<Driver> {
  const response = await fetchFn(`${API_BASE_URL}/drivers/${driverId}/employment-status/activate`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to activate driver: ${response.statusText}`);
  }

  return response.json().then(res => res.data);
}

export async function suspendDriver(
  driverId: string,
  fetchFn: typeof fetch = fetch
): Promise<Driver> {
  const response = await fetchFn(`${API_BASE_URL}/drivers/${driverId}/employment-status/suspend`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to suspend driver: ${response.statusText}`);
  }

  return response.json().then(res => res.data);
}

export async function terminateDriver(
  driverId: string,
  fetchFn: typeof fetch = fetch
): Promise<Driver> {
  const response = await fetchFn(`${API_BASE_URL}/drivers/${driverId}/employment-status/terminate`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to terminate driver: ${response.statusText}`);
  }

  return response.json().then(res => res.data);
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
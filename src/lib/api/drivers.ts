import { fetchApi, type ApiResponse, fetchSingleItem, mutateApi } from './client';

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
  try {
    const response = await fetchSingleItem<Driver>(`/drivers/${id}`, fetchFn);

    return response;
  } catch (err) {
    console.error('[getDriver] Error details:', {
      error: err,
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined
    });
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
    console.log('Creating driver with payload:', driver);
    const result = await mutateApi<Driver>('/drivers', 'POST', driver, fetchFn);
    console.log('Driver creation response:', result);
    return result;
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
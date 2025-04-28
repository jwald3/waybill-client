import { fetchApi, type ApiResponse, fetchSingleItem, mutateApi, API_BASE_URL } from './client';

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
  status: 'AVAILABLE' | 'IN_TRANSIT' | 'UNDER_MAINTENANCE' | 'RETIRED';
  trailer_type: 'DRY_VAN' | 'REFRIGERATED' | 'FLAT_BED' | 'TANKER' | 'AUTO_CARRIER' | 'LIVE_STOCK' | 'INTERMODAL' | 'LOGGING' | 'PNEUMATIC_TANK';
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
  trailer_type: 'DRY_VAN' | 'REFRIGERATED' | 'FLAT_BED' | 'TANKER' | 'AUTO_CARRIER' | 'LIVE_STOCK' | 'INTERMODAL' | 'LOGGING' | 'PNEUMATIC_TANK';
  capacity_tons: number;
  fuel_type: string;
  last_maintenance: string;
}

export type TruckStatus = 'AVAILABLE' | 'IN_TRANSIT' | 'UNDER_MAINTENANCE' | 'RETIRED';

export async function getTruck(id: string, fetchFn: typeof fetch = fetch): Promise<Truck> {
  try {
    const response = await fetchSingleItem<Truck>(`/trucks/${id}`, fetchFn);
    return response;
  } catch (err) {
    console.error('[getTruck] Error details:', {
      error: err,
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined
    });
    throw err;
  }
}

export async function createTruck(truck: CreateTruckPayload, fetchFn: typeof fetch = fetch): Promise<Truck> {
  try {
    const response = await mutateApi<Truck>('/trucks', 'POST', truck, fetchFn);
    return response;
  } catch (err) {
    console.error('Error creating truck:', err);
    throw err;
  }
}

export async function getTrucks(fetchFn: typeof fetch = fetch): Promise<ApiResponse<Truck>> {
  return fetchApi<Truck>('/trucks', fetchFn);
}

export async function setTruckAvailable(
  truckId: string,
  fetchFn: typeof fetch = fetch
): Promise<Truck> {
  const response = await fetchFn(`${API_BASE_URL}/trucks/${truckId}/status/available`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to set truck as available: ${response.statusText}`);
  }

  return response.json().then(res => res.data);
}

export async function setTruckInTransit(
  truckId: string,
  fetchFn: typeof fetch = fetch
): Promise<Truck> {
  const response = await fetchFn(`${API_BASE_URL}/trucks/${truckId}/status/in-transit`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to set truck in transit: ${response.statusText}`);
  }

  return response.json().then(res => res.data);
}

export async function setTruckInMaintenance(
  truckId: string,
  fetchFn: typeof fetch = fetch
): Promise<Truck> {
  const response = await fetchFn(`${API_BASE_URL}/trucks/${truckId}/status/maintenance`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to set truck in maintenance: ${response.statusText}`);
  }

  return response.json().then(res => res.data);
}

export async function retireTruck(
  truckId: string,
  fetchFn: typeof fetch = fetch
): Promise<Truck> {
  const response = await fetchFn(`${API_BASE_URL}/trucks/${truckId}/status/retire`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to retire truck: ${response.statusText}`);
  }

  return response.json().then(res => res.data);
}

export function getAvailableStatusTransitions(currentStatus: TruckStatus): Array<{value: TruckStatus, label: string}> {
  switch (currentStatus) {
    case 'AVAILABLE':
      return [
        { value: 'IN_TRANSIT', label: 'Set In Transit' },
        { value: 'UNDER_MAINTENANCE', label: 'Set Under Maintenance' },
        { value: 'RETIRED', label: 'Retire Truck' }
      ];
    case 'IN_TRANSIT':
      return [
        { value: 'AVAILABLE', label: 'Mark as Available' },
        { value: 'UNDER_MAINTENANCE', label: 'Set Under Maintenance' }
      ];
    case 'UNDER_MAINTENANCE':
      return [
        { value: 'AVAILABLE', label: 'Mark as Available' },
        { value: 'RETIRED', label: 'Retire Truck' }
      ];
    default:
      return [];
  }
} 
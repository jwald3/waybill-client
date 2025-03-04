import { fetchApi, type ApiResponse, API_BASE_URL } from './client';

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
  status: 'IN_TRANSIT' | 'MAINTENANCE' | 'AVAILABLE';
  trailer_type: 'DRY_VAN' | 'REFRIGERATED' | 'FLATBED';
  capacity_tons: number;
  fuel_type: string;
  last_maintenance: string;
  created_at: string;
  updated_at: string;
}

interface TruckResponse {
  data: Truck;
}

export async function getTruck(id: string): Promise<Truck> {
  const response = await fetch(`${API_BASE_URL}/trucks/${id}`);
  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
  const result: TruckResponse = await response.json();
  return result.data;
}

export async function getTrucks(): Promise<ApiResponse<Truck>> {
  return fetchApi<Truck>('/trucks');
} 
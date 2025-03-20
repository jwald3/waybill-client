import * as fc from 'fast-check';
import {
  getTrucks,
  getTruck,
  createTruck,
  setTruckAvailable,
  setTruckInTransit,
  setTruckInMaintenance,
  retireTruck,
  getAvailableStatusTransitions,
  type Truck,
  type CreateTruckPayload,
  type LicensePlate,
  type TruckStatus
} from './trucks';

// Test data generators
const licensePlateArbitrary = fc.record<LicensePlate>({
  number: fc.string({ minLength: 5, maxLength: 8 })
    .map(s => s.toUpperCase()),
  state: fc.constantFrom('CA', 'NY', 'TX', 'FL', 'IL')
});

const trailerTypes = [
  'DRY_VAN', 'REFRIGERATED', 'FLAT_BED', 'TANKER',
  'AUTO_CARRIER', 'LIVE_STOCK', 'INTERMODAL', 'LOGGING', 'PNEUMATIC_TANK'
] as const;

const createTruckPayloadArbitrary = fc.record<CreateTruckPayload>({
  truck_number: fc.string({ minLength: 3, maxLength: 10 })
    .map(s => s.toUpperCase()),
  vin: fc.string({ minLength: 17, maxLength: 17 })
    .map(s => s.toUpperCase()),
  make: fc.string({ minLength: 2, maxLength: 20 }),
  model: fc.string({ minLength: 2, maxLength: 20 }),
  year: fc.integer({ min: 1990, max: new Date().getFullYear() }),
  license_plate: licensePlateArbitrary,
  mileage: fc.integer({ min: 0, max: 1000000 }),
  trailer_type: fc.constantFrom(...trailerTypes),
  capacity_tons: fc.float({ min: 1, max: 50 }),
  fuel_type: fc.constantFrom('DIESEL', 'GASOLINE', 'ELECTRIC', 'HYBRID'),
  last_maintenance: fc.date().map(d => d.toISOString().split('T')[0])
});

const mockTruck: Truck = {
  id: '123',
  truck_number: 'TRK001',
  vin: '1HGCM82633A123456',
  make: 'Freightliner',
  model: 'Cascadia',
  year: 2020,
  license_plate: {
    number: 'ABC123',
    state: 'CA'
  },
  mileage: 50000,
  status: 'AVAILABLE',
  trailer_type: 'DRY_VAN',
  capacity_tons: 25,
  fuel_type: 'DIESEL',
  last_maintenance: '2023-01-01',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z'
};

describe('Trucks API Client', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
  });

  describe('getTrucks', () => {
    it('should fetch trucks successfully', async () => {
      const mockResponse = {
        items: [mockTruck],
        total: 1,
        limit: 10,
        offset: 0
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await getTrucks(mockFetch);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/trucks'),
        expect.objectContaining({
          headers: { 'Content-Type': 'application/json' }
        })
      );
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error'
      });

      await expect(getTrucks(mockFetch)).rejects.toThrow('API call failed');
    });
  });

  describe('getTruck', () => {
    it('should fetch a single truck successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockTruck })
      });

      const result = await getTruck('123', mockFetch);
      expect(result).toEqual(mockTruck);
    });

    it('should handle missing data in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      });

      await expect(getTruck('123', mockFetch)).rejects.toThrow('Invalid response format');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      await expect(getTruck('123', mockFetch)).rejects.toThrow('Network error');
    });
  });

  describe('createTruck', () => {
    it('should create trucks with valid payloads', async () => {
      await fc.assert(
        fc.asyncProperty(createTruckPayloadArbitrary, async (payload) => {
          const mockResponse = {
            data: { ...payload, id: '123', status: 'AVAILABLE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
          };

          const mockFetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse)
          });

          const result = await createTruck(payload, mockFetch);
          
          expect(result).toEqual(mockResponse.data);
          expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('/trucks'),
            expect.objectContaining({
              method: 'POST',
              body: JSON.stringify(payload)
            })
          );
        })
      );
    });

    it('should handle API errors during creation', async () => {
      const payload = await fc.sample(createTruckPayloadArbitrary, 1)[0];
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: () => Promise.resolve('Invalid VIN format')
      });

      await expect(createTruck(payload, mockFetch)).rejects.toThrow('API call failed');
    });
  });

  describe('status operations', () => {
    const setupStatusTest = (status: TruckStatus) => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { ...mockTruck, status } })
      });
    };

    it('should set truck as available', async () => {
      setupStatusTest('AVAILABLE');
      const result = await setTruckAvailable('123', mockFetch);
      expect(result.status).toBe('AVAILABLE');
    });

    it('should set truck in transit', async () => {
      setupStatusTest('IN_TRANSIT');
      const result = await setTruckInTransit('123', mockFetch);
      expect(result.status).toBe('IN_TRANSIT');
    });

    it('should set truck in maintenance', async () => {
      setupStatusTest('UNDER_MAINTENANCE');
      const result = await setTruckInMaintenance('123', mockFetch);
      expect(result.status).toBe('UNDER_MAINTENANCE');
    });

    it('should retire truck', async () => {
      setupStatusTest('RETIRED');
      const result = await retireTruck('123', mockFetch);
      expect(result.status).toBe('RETIRED');
    });

    it('should handle errors in status changes', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Forbidden'
      });

      await expect(setTruckAvailable('123', mockFetch)).rejects.toThrow('Failed to set truck as available');
    });
  });

  describe('getAvailableStatusTransitions', () => {
    it('should return correct transitions for AVAILABLE status', () => {
      const transitions = getAvailableStatusTransitions('AVAILABLE');
      expect(transitions).toHaveLength(3);
      expect(transitions).toContainEqual({ value: 'IN_TRANSIT', label: 'Set In Transit' });
      expect(transitions).toContainEqual({ value: 'UNDER_MAINTENANCE', label: 'Set Under Maintenance' });
      expect(transitions).toContainEqual({ value: 'RETIRED', label: 'Retire Truck' });
    });

    it('should return correct transitions for IN_TRANSIT status', () => {
      const transitions = getAvailableStatusTransitions('IN_TRANSIT');
      expect(transitions).toHaveLength(2);
      expect(transitions).toContainEqual({ value: 'AVAILABLE', label: 'Mark as Available' });
      expect(transitions).toContainEqual({ value: 'UNDER_MAINTENANCE', label: 'Set Under Maintenance' });
    });

    it('should return correct transitions for UNDER_MAINTENANCE status', () => {
      const transitions = getAvailableStatusTransitions('UNDER_MAINTENANCE');
      expect(transitions).toHaveLength(2);
      expect(transitions).toContainEqual({ value: 'AVAILABLE', label: 'Mark as Available' });
      expect(transitions).toContainEqual({ value: 'RETIRED', label: 'Retire Truck' });
    });

    it('should return empty array for RETIRED status', () => {
      const transitions = getAvailableStatusTransitions('RETIRED');
      expect(transitions).toHaveLength(0);
    });
  });

  describe('property-based tests', () => {
    it('should maintain data integrity through create-fetch cycle', async () => {
      await fc.assert(
        fc.asyncProperty(createTruckPayloadArbitrary, async (payload) => {
          const createdTruck = {
            ...payload,
            id: '123',
            status: 'AVAILABLE',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          const mockFetch = jest.fn()
            .mockResolvedValueOnce({
              ok: true,
              json: () => Promise.resolve({ data: createdTruck })
            })
            .mockResolvedValueOnce({
              ok: true,
              json: () => Promise.resolve({ data: createdTruck })
            });

          const created = await createTruck(payload, mockFetch);
          const fetched = await getTruck(created.id, mockFetch);

          expect(fetched).toEqual(created);
          expect(fetched.truck_number).toBe(payload.truck_number);
          expect(fetched.vin).toBe(payload.vin);
        })
      );
    });
  });
}); 
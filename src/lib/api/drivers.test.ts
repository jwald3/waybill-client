import * as fc from 'fast-check';
import { 
  getDrivers, 
  getDriver, 
  createDriver, 
  activateDriver,
  suspendDriver,
  terminateDriver,
  getAvailableStatusTransitions,
  type Driver,
  type CreateDriverPayload,
  type Address
} from './drivers';

// Test data generators
const addressArbitrary = fc.record<Address>({
  street: fc.string({ minLength: 5, maxLength: 100 }),
  city: fc.string({ minLength: 2, maxLength: 50 }),
  state: fc.string({ minLength: 2, maxLength: 2 }),
  zip: fc.string({ minLength: 5, maxLength: 10 })
});

const createDriverPayloadArbitrary = fc.record<CreateDriverPayload>({
  first_name: fc.string({ minLength: 1, maxLength: 50 }),
  last_name: fc.string({ minLength: 1, maxLength: 50 }),
  dob: fc.date().map(d => d.toISOString().split('T')[0]),
  license_number: fc.string({ minLength: 5, maxLength: 20 }),
  license_state: fc.string({ minLength: 2, maxLength: 2 }),
  license_expiration: fc.date().map(d => d.toISOString().split('T')[0]),
  phone: fc.string({ minLength: 10, maxLength: 15 }),
  email: fc.emailAddress(),
  address: addressArbitrary
});

const mockDriver: Driver = {
  id: '123',
  first_name: 'John',
  last_name: 'Doe',
  dob: '1990-01-01',
  license_number: 'DL123456',
  license_state: 'CA',
  license_expiration: '2025-01-01',
  phone: '555-0123',
  email: 'john@example.com',
  address: {
    street: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zip: '62701'
  },
  employment_status: 'ACTIVE',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z'
};

describe('Drivers API Client', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
  });

  describe('getDrivers', () => {
    it('should fetch drivers successfully', async () => {
      const mockResponse = {
        items: [mockDriver],
        total: 1,
        limit: 10,
        offset: 0
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await getDrivers(mockFetch);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/drivers'),
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

      await expect(getDrivers(mockFetch)).rejects.toThrow('API call failed');
    });
  });

  describe('getDriver', () => {
    it('should fetch a single driver successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockDriver })
      });

      const result = await getDriver('123', mockFetch);
      expect(result).toEqual(mockDriver);
    });

    it('should handle missing data in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      });

      await expect(getDriver('123', mockFetch)).rejects.toThrow('Invalid response format');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      await expect(getDriver('123', mockFetch)).rejects.toThrow('Network error');
    });
  });

  describe('createDriver', () => {
    it('should create a driver with valid payload', async () => {
      await fc.assert(
        fc.asyncProperty(createDriverPayloadArbitrary, async (payload) => {
          const mockResponse = {
            data: { ...payload, id: '123', employment_status: 'ACTIVE', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
          };

          const mockFetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse)
          });

          global.fetch = mockFetch;
          const result = await createDriver(payload);
          
          expect(result).toEqual(mockResponse.data);
          expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('/drivers'),
            expect.objectContaining({
              method: 'POST',
              body: JSON.stringify(payload)
            })
          );
        })
      );
    });
  });

  describe('employment status operations', () => {
    const setupStatusTest = (endpoint: string) => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: { ...mockDriver, employment_status: endpoint.toUpperCase() } })
      });
    };

    it('should activate a driver', async () => {
      setupStatusTest('ACTIVE');
      const result = await activateDriver('123', mockFetch);
      expect(result.employment_status).toBe('ACTIVE');
    });

    it('should suspend a driver', async () => {
      setupStatusTest('SUSPENDED');
      const result = await suspendDriver('123', mockFetch);
      expect(result.employment_status).toBe('SUSPENDED');
    });

    it('should terminate a driver', async () => {
      setupStatusTest('TERMINATED');
      const result = await terminateDriver('123', mockFetch);
      expect(result.employment_status).toBe('TERMINATED');
    });

    it('should handle errors in status changes', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Forbidden'
      });

      await expect(activateDriver('123', mockFetch)).rejects.toThrow('Failed to activate driver');
    });
  });

  describe('getAvailableStatusTransitions', () => {
    it('should return correct transitions for ACTIVE status', () => {
      const transitions = getAvailableStatusTransitions('ACTIVE');
      expect(transitions).toHaveLength(2);
      expect(transitions).toContainEqual({ value: 'SUSPENDED', label: 'Suspend Driver' });
      expect(transitions).toContainEqual({ value: 'TERMINATED', label: 'Terminate Driver' });
    });

    it('should return correct transitions for SUSPENDED status', () => {
      const transitions = getAvailableStatusTransitions('SUSPENDED');
      expect(transitions).toHaveLength(2);
      expect(transitions).toContainEqual({ value: 'ACTIVE', label: 'Reactivate Driver' });
      expect(transitions).toContainEqual({ value: 'TERMINATED', label: 'Terminate Driver' });
    });

    it('should return empty array for TERMINATED status', () => {
      const transitions = getAvailableStatusTransitions('TERMINATED');
      expect(transitions).toHaveLength(0);
    });
  });
}); 
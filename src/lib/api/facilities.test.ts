import * as fc from 'fast-check';
import {
  getFacilities,
  getFacility,
  createFacility,
  type Facility,
  type CreateFacilityPayload,
  type Address,
  type ContactInfo
} from './facilities';

// Test data generators
const addressArbitrary = fc.record<Address>({
  street: fc.string({ minLength: 5, maxLength: 100 }),
  city: fc.string({ minLength: 2, maxLength: 50 }),
  state: fc.constantFrom(
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ),
  zip: fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 5, maxLength: 5 })
    .map(digits => digits.join(''))
});

const contactInfoArbitrary = fc.record<ContactInfo>({
  phone: fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 10, maxLength: 10 })
    .map((digits: number[]) => {
      const s = digits.join('');
      return `${s.slice(0, 3)}-${s.slice(3, 6)}-${s.slice(6)}`;
    }),
  email: fc.emailAddress()
});

const facilityTypes = [
  'WAREHOUSE',
  'DISTRIBUTION_CENTER',
  'CROSS_DOCK',
  'MAINTENANCE_SHOP',
  'TRUCK_STOP',
  'PARKING_LOT'
] as const;

const availableServices = [
  'LOADING',
  'UNLOADING',
  'STORAGE',
  'MAINTENANCE',
  'FUEL',
  'PARKING',
  'WASHING',
  'SECURITY',
  'CUSTOMS_CLEARANCE'
] as const;

const createFacilityPayloadArbitrary = fc.record<CreateFacilityPayload>({
  facility_number: fc.string({ minLength: 3, maxLength: 10 })
    .map(s => s.toUpperCase()),
  name: fc.string({ minLength: 3, maxLength: 50 }),
  type: fc.constantFrom(...facilityTypes),
  address: addressArbitrary,
  contact_info: contactInfoArbitrary,
  parking_capacity: fc.integer({ min: 5, max: 500 }),
  services_available: fc.uniqueArray(fc.constantFrom(...availableServices), {
    minLength: 1,
    maxLength: 5
  })
});

const mockFacility: Facility = {
  id: '123',
  facility_number: 'FAC001',
  name: 'Main Distribution Center',
  type: 'DISTRIBUTION_CENTER',
  address: {
    street: '123 Logistics Way',
    city: 'Springfield',
    state: 'IL',
    zip: '62701'
  },
  contact_info: {
    phone: '555-123-4567',
    email: 'facility@example.com'
  },
  parking_capacity: 100,
  services_available: ['LOADING', 'UNLOADING', 'STORAGE'],
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z'
};

describe('Facilities API Client', () => {
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getFacilities', () => {
    it('should fetch facilities successfully', async () => {
      const mockResponse = {
        items: [mockFacility],
        total: 1,
        limit: 10,
        offset: 0
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await getFacilities(mockFetch);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/facilities'),
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

      await expect(getFacilities(mockFetch)).rejects.toThrow('API call failed');
    });
  });

  describe('getFacility', () => {
    it('should fetch a single facility successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockFacility })
      });

      const result = await getFacility('123', mockFetch);
      expect(result).toEqual(mockFacility);
    });

    it('should handle missing data in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      });

      await expect(getFacility('123', mockFetch)).rejects.toThrow('Invalid response format');
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      await expect(getFacility('123', mockFetch)).rejects.toThrow('Network error');
    });

    it('should handle API errors with error text', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: () => Promise.resolve('Facility not found')
      });

      await expect(getFacility('123', mockFetch)).rejects.toThrow('API call failed: 404 Not Found');
    });
  });

  describe('createFacility', () => {
    it('should create facilities with valid payloads', async () => {
      await fc.assert(
        fc.asyncProperty(createFacilityPayloadArbitrary, async (payload) => {
          const mockResponse = {
            data: { 
              ...payload,
              id: '123',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          };

          const mockFetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockResponse)
          });

          const result = await createFacility(payload, mockFetch);
          
          expect(result).toEqual(mockResponse.data);
          expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('/facilities'),
            expect.objectContaining({
              method: 'POST',
              body: JSON.stringify(payload)
            })
          );
        })
      );
    });

    it('should handle API errors during creation', async () => {
      const payload = await fc.sample(createFacilityPayloadArbitrary, 1)[0];
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        text: () => Promise.resolve('Invalid facility data')
      });

      await expect(createFacility(payload, mockFetch)).rejects.toThrow('API call failed');
    });

    it('should validate parking capacity is positive', async () => {
      await fc.assert(
        fc.property(createFacilityPayloadArbitrary, (payload) => {
          expect(payload.parking_capacity).toBeGreaterThan(0);
        })
      );
    });
  });

  describe('property-based tests', () => {
    it('should maintain data integrity through create-fetch cycle', async () => {
      await fc.assert(
        fc.asyncProperty(createFacilityPayloadArbitrary, async (payload) => {
          const createdFacility = {
            ...payload,
            id: '123',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          const mockFetch = jest.fn()
            .mockResolvedValueOnce({
              ok: true,
              json: () => Promise.resolve({ data: createdFacility })
            })
            .mockResolvedValueOnce({
              ok: true,
              json: () => Promise.resolve({ data: createdFacility })
            });

          const created = await createFacility(payload, mockFetch);
          const fetched = await getFacility(created.id, mockFetch);

          expect(fetched).toEqual(created);
          expect(fetched.facility_number).toBe(payload.facility_number);
          expect(fetched.services_available).toEqual(expect.arrayContaining(payload.services_available));
        })
      );
    });

    it('should handle various address formats', async () => {
      await fc.assert(
        fc.asyncProperty(addressArbitrary, async (address) => {
          expect(address.state).toMatch(/^[A-Z]{2}$/);
          expect(address.zip).toMatch(/^\d{5}$/);
          expect(address.city.length).toBeGreaterThanOrEqual(2);
          expect(address.street.length).toBeGreaterThanOrEqual(5);
        })
      );
    });

    it('should validate contact information', async () => {
      await fc.assert(
        fc.asyncProperty(contactInfoArbitrary, async (contactInfo) => {
          expect(contactInfo.phone).toMatch(/^\d{3}-\d{3}-\d{4}$/);
          expect(contactInfo.email).toContain('@');
        })
      );
    });
  });
}); 
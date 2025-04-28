import type { PageLoad } from './$types';
import { getFacilities, type Facility } from '$lib/api/facilities';

export const load = (async ({ fetch }) => {
  try {
    const response = await getFacilities(fetch);
    return {
      facilities: response.items,
      error: null
    };
  } catch (error) {
    console.error('Failed to load facilities:', error);
    return {
      facilities: [] as Facility[],
      error: 'Failed to load facilities: ' + error
    };
  }
}) satisfies PageLoad; 
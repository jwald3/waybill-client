import type { PageLoad } from './$types';
import { getFacilities } from '$lib/api/facilities';

export const load = (async ({ fetch }) => {
  try {
    const facilitiesResponse = await getFacilities(fetch);
    return {
      facilities: facilitiesResponse.items,
      error: null
    };
  } catch (error) {
    console.error('Failed to load facilities:', error);
    return {
      facilities: [],
      error: 'Failed to load facilities. Please try again later.'
    };
  }
}) satisfies PageLoad; 
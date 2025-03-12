import type { PageLoad } from './$types';
import { getTrips } from '$lib/api/trips';

export const load = (async ({ fetch }) => {
  try {
    const tripsResponse = await getTrips(fetch);
    return {
      trips: tripsResponse.items,
      error: null
    };
  } catch (error) {
    console.error('Failed to load trips:', error);
    return {
      trips: [],
      error: 'Failed to load trips. Please try again later.'
    };
  }
}) satisfies PageLoad; 
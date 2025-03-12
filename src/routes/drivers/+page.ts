import type { PageLoad } from './$types';
import { getDrivers } from '$lib/api/drivers';

export const load = (async ({ fetch }) => {
  try {
    const driversResponse = await getDrivers(fetch);
    return {
      drivers: driversResponse.items,
      error: null
    };
  } catch (error) {
    console.error('Failed to load drivers:', error);
    return {
      drivers: [],
      error: 'Failed to load drivers. Please try again later.'
    };
  }
}) satisfies PageLoad;
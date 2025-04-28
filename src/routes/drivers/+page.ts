import { getDrivers } from '$lib/api/drivers';
import type { PageLoad } from './$types';
import type { Driver } from '$lib/api/drivers';

export const ssr = false;

export const load: PageLoad = async ({ fetch }) => {
  try {
    const response = await getDrivers(fetch);
    return {
      drivers: response.items,
      error: null
    };
  } catch (error) {
    return {
      drivers: [] as Driver[],
      error: 'Failed to load drivers: ' + error
    };
  }
};
import type { PageLoad } from './$types';
import { getTrucks, type Truck } from '$lib/api/trucks';

export const load: PageLoad = (async ({ fetch }) => {
  try {
    const response = await getTrucks(fetch);
    return {
      trucks: response.items,
      error: null
    };
  } catch (error) {
    console.error('Failed to load trucks:', error);
    return {
      trucks: [] as Truck[],
      error: 'Failed to load trucks: ' + error
    };
  }
}) satisfies PageLoad;
import type { PageLoad } from './$types';
import { getTrucks } from '$lib/api/trucks';

export const load = (async ({ fetch }) => {
  try {
    const trucksResponse = await getTrucks(fetch);
    return {
      trucks: trucksResponse.items,
      error: null
    };
  } catch (error) {
    console.error('Failed to load trucks:', error);
    return {
      trucks: [],
      error: 'Failed to load trucks. Please try again later.'
    };
  }
}) satisfies PageLoad;
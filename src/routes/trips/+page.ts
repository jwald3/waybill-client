import { getTrips } from '$lib/api/trips';
import type { PageLoad } from './$types';
import type { Trip } from '$lib/api/trips';
import { browser } from '$app/environment';

// Force client-side rendering
export const ssr = false;
export const csr = true;

export const load: PageLoad = async ({ fetch }) => {
  // Only fetch data on the client side
  if (!browser) {
    return {
      trips: [] as Trip[],
      error: null
    };
  }

  try {
    const response = await getTrips(fetch);
    return {
      trips: response.items,
      error: null
    };
  } catch (error) {
    // If we get a 401, redirect to login
    if (error instanceof Error && error.message.includes('401')) {
      if (browser) {
        window.location.href = '/login';
      }
      return {
        trips: [] as Trip[],
        error: 'Authentication required'
      };
    }

    return {
      trips: [] as Trip[],
      error: 'Failed to load trips: ' + error
    };
  }
};
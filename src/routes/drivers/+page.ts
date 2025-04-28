import { getDrivers } from '$lib/api/drivers';
import type { PageLoad } from './$types';
import type { Driver } from '$lib/api/drivers';
import { browser } from '$app/environment';

// Force client-side rendering
export const ssr = false;
export const csr = true;

export const load: PageLoad = async ({ fetch }) => {
  // Only fetch data on the client side
  if (!browser) {
    return {
      drivers: [] as Driver[],
      error: null
    };
  }

  try {
    const response = await getDrivers(fetch);
    return {
      drivers: response.items,
      error: null
    };
  } catch (error) {
    // If we get a 401, redirect to login
    if (error instanceof Error && error.message.includes('401')) {
      if (browser) {
        window.location.href = '/login';
      }
      return {
        drivers: [] as Driver[],
        error: 'Authentication required'
      };
    }

    return {
      drivers: [] as Driver[],
      error: 'Failed to load drivers: ' + error
    };
  }
};
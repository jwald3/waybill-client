import { getTrucks } from '$lib/api/trucks';
import type { PageLoad } from './$types';
import type { Truck } from '$lib/api/trucks';
import { browser } from '$app/environment';

// Force client-side rendering
export const ssr = false;
export const csr = true;

export const load: PageLoad = async ({ fetch }) => {
  // Only fetch data on the client side
  if (!browser) {
    return {
      trucks: [] as Truck[],
      error: null
    };
  }

  try {
    const response = await getTrucks(fetch);
    return {
      trucks: response.items,
      error: null
    };
  } catch (error) {
    // If we get a 401, redirect to login
    if (error instanceof Error && error.message.includes('401')) {
      if (browser) {
        window.location.href = '/login';
      }
      return {
        trucks: [] as Truck[],
        error: 'Authentication required'
      };
    }

    return {
      trucks: [] as Truck[],
      error: 'Failed to load trucks: ' + error
    };
  }
};
import { getFacilities } from '$lib/api/facilities';
import type { PageLoad } from './$types';
import type { Facility } from '$lib/api/facilities';
import { browser } from '$app/environment';

// Force client-side rendering
export const ssr = false;
export const csr = true;

export const load: PageLoad = async ({ fetch }) => {
  // Only fetch data on the client side
  if (!browser) {
    return {
      facilities: [] as Facility[],
      error: null
    };
  }

  try {
    const response = await getFacilities(fetch);
    return {
      facilities: response.items,
      error: null
    };
  } catch (error) {
    // If we get a 401, redirect to login
    if (error instanceof Error && error.message.includes('401')) {
      if (browser) {
        window.location.href = '/login';
      }
      return {
        facilities: [] as Facility[],
        error: 'Authentication required'
      };
    }

    return {
      facilities: [] as Facility[],
      error: 'Failed to load facilities: ' + error
    };
  }
};
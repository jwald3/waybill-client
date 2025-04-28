import { getIncidents } from '$lib/api/incidents';
import type { PageLoad } from './$types';
import type { IncidentReport } from '$lib/api/incidents';
import { browser } from '$app/environment';

// Force client-side rendering
export const ssr = false;
export const csr = true;

export const load: PageLoad = async ({ fetch }) => {
  // Only fetch data on the client side
  if (!browser) {
    return {
      incidents: [] as IncidentReport[],
      error: null
    };
  }

  try {
    const response = await getIncidents(fetch);
    return {
      incidents: response.items,
      error: null
    };
  } catch (error) {
    // If we get a 401, redirect to login
    if (error instanceof Error && error.message.includes('401')) {
      if (browser) {
        window.location.href = '/login';
      }
      return {
        incidents: [] as IncidentReport[],
        error: 'Authentication required'
      };
    }

    return {
      incidents: [] as IncidentReport[],
      error: 'Failed to load incidents: ' + error
    };
  }
};
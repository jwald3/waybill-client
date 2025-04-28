import { getMaintenanceLogs } from '$lib/api/maintenance';
import type { PageLoad } from './$types';
import type { MaintenanceLog } from '$lib/api/maintenance';
import { browser } from '$app/environment';

// Force client-side rendering
export const ssr = false;
export const csr = true;

export const load: PageLoad = async ({ fetch }) => {
  // Only fetch data on the client side
  if (!browser) {
    return {
      maintenanceLogs: [] as MaintenanceLog[],
      error: null
    };
  }

  try {
    const response = await getMaintenanceLogs(fetch);
    return {
      maintenanceLogs: response.items,
      error: null
    };
  } catch (error) {
    // If we get a 401, redirect to login
    if (error instanceof Error && error.message.includes('401')) {
      if (browser) {
        window.location.href = '/login';
      }
      return {
        maintenanceLogs: [] as MaintenanceLog[],
        error: 'Authentication required'
      };
    }

    return {
      maintenanceLogs: [] as MaintenanceLog[],
        error: 'Failed to load maintenance log: ' + error
    };
  }
};
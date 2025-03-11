import type { PageLoad } from './$types';
import { getMaintenanceLogs } from '$lib/api/maintenance';

export const load = (async ({ fetch }) => {
  try {
    const maintenanceResponse = await getMaintenanceLogs(fetch);
    return {
      maintenanceLogs: maintenanceResponse.items,
      error: null
    };
  } catch (error) {
    console.error('Failed to load maintenance logs:', error);
    return {
      maintenanceLogs: [],
      error: 'Failed to load maintenance logs. Please try again later.'
    };
  }
}) satisfies PageLoad; 
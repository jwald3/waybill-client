import type { PageLoad } from './$types';
import { getMaintenanceLogs, type MaintenanceLog } from '$lib/api/maintenance';

export const load = (async ({ fetch }) => {
  try {
    const response = await getMaintenanceLogs(fetch);
    return {
      maintenanceLogs: response.items,
      error: null
    };
  } catch (error) {
    console.error('Failed to load maintenance logs:', error);
    return {
      maintenanceLogs: [] as MaintenanceLog[],
      error: 'Failed to load maintenance logs: ' + error
    };
  }
}) satisfies PageLoad; 
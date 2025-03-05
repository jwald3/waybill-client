import type { PageLoad } from './$types';
import { getMaintenanceLogs } from '$lib/api/maintenance';

export const load = (async ({ fetch }) => {
  const maintenanceResponse = await getMaintenanceLogs(fetch);
  return {
    maintenanceLogs: maintenanceResponse.items
  };
}) satisfies PageLoad; 
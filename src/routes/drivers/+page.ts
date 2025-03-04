import type { PageLoad } from './$types';
import { getDrivers } from '$lib/api/drivers';

export const load = (async ({ fetch }) => {
  const driversResponse = await getDrivers(fetch);
  return {
    drivers: driversResponse.items
  };
}) satisfies PageLoad; 
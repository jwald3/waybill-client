import type { PageLoad } from './$types';
import { getTrips } from '$lib/api/trips';

export const load = (async ({ fetch }) => {
  const tripsResponse = await getTrips(fetch);
  return {
    trips: tripsResponse.items
  };
}) satisfies PageLoad; 
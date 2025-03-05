import type { PageLoad } from './$types';
import { getFacilities } from '$lib/api/facilities';

export const load = (async ({ fetch }) => {
  const facilitiesResponse = await getFacilities(fetch);
  return {
    facilities: facilitiesResponse.items
  };
}) satisfies PageLoad; 
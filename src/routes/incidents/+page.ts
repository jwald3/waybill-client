import type { PageLoad } from './$types';
import { getIncidents } from '$lib/api/incidents';

export const load = (async ({ fetch }) => {
  const incidentsResponse = await getIncidents(fetch);
  return {
    incidents: incidentsResponse.items
  };
}) satisfies PageLoad; 
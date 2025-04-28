import type { PageLoad } from './$types';
import { getIncidents, type IncidentReport } from '$lib/api/incidents';

export const load = (async ({ fetch }) => {
  try {
    const response = await getIncidents(fetch);
    return {
      incidents: response.items,
      error: null
    };
  } catch (error) {
    console.error('Failed to load incidents:', error);
    return {
      incidents: [] as IncidentReport[],
      error: 'Failed to load incidents: ' + error
    };
  }
}) satisfies PageLoad; 
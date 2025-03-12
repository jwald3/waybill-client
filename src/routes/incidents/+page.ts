import type { PageLoad } from './$types';
import { getIncidents } from '$lib/api/incidents';

export const load = (async ({ fetch }) => {
  try {
    const incidentsResponse = await getIncidents(fetch);
    return {
      incidents: incidentsResponse.items,
      error: null
    };
  } catch (error) {
    console.error('Failed to load incidents:', error);
    return {
      incidents: [],
      error: 'Failed to load incidents. Please try again later.'
    };
  }
}) satisfies PageLoad; 
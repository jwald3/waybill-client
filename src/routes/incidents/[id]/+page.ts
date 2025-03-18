import { getIncident } from '$lib/api/incidents';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, fetch }) => {
  try {
    const incident = await getIncident(params.id, fetch);
    return { incident };
  } catch (err) {
    console.error('Failed to load incident:', err);
    throw error(err instanceof Error && err.message.includes('404') ? 404 : 500, {
      message: err instanceof Error ? err.message : 'Failed to load incident'
    });
  }
}) satisfies PageLoad; 
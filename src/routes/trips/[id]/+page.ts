import { getTrip } from '$lib/api/trips';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, fetch }) => {
  try {
    const trip = await getTrip(params.id, fetch);
    return { trip };
  } catch (err) {
    console.error('Failed to load trip:', err);
    throw error(err instanceof Error && err.message.includes('404') ? 404 : 500, {
      message: err instanceof Error ? err.message : 'Failed to load trip'
    });
  }
}) satisfies PageLoad; 
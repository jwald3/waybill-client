import { getFacility } from '$lib/api/facilities';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, fetch }) => {
  try {
    const facility = await getFacility(params.id, fetch);
    return { facility };
  } catch (err) {
    console.error('Failed to load facility:', err);
    throw error(err instanceof Error && err.message.includes('404') ? 404 : 500, {
      message: err instanceof Error ? err.message : 'Failed to load facility'
    });
  }
}) satisfies PageLoad; 
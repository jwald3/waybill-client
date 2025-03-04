import { getTrip } from '$lib/api/trips';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
  try {
    const trip = await getTrip(params.id);
    return { trip };
  } catch (err) {
    throw error(404, {
      message: 'Trip not found'
    });
  }
}) satisfies PageLoad; 
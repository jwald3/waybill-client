import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getDriver } from '$lib/api/drivers';

export const load = (async ({ params, fetch }) => {
  try {
    const driver = await getDriver(params.id, fetch);
    return { driver };
  } catch (err) {
    console.error('Failed to load driver:', err);
    throw error(err instanceof Error && err.message.includes('404') ? 404 : 500, {
      message: err instanceof Error ? err.message : 'Failed to load driver'
    });
  }
}) satisfies PageLoad; 
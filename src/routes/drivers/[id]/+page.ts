import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getDriver } from '$lib/api/drivers';

export const load = (async ({ params }) => {
  try {
    const driver = await getDriver(params.id);
    return { driver };
  } catch (_err) {
    throw error(404, {
      message: 'Driver not found'
    });
  }
}) satisfies PageLoad; 
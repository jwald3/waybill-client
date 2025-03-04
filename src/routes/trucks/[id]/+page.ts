import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getTruck } from '$lib/api/trucks';

export const load = (async ({ params, fetch }) => {
  try {
    const truck = await getTruck(params.id, fetch);
    return { truck };
  } catch (_err) {
    throw error(404, {
      message: 'Truck not found'
    });
  }
}) satisfies PageLoad; 
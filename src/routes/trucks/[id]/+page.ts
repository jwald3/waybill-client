import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getTruck } from '$lib/api/trucks';

export const load = (async ({ params, fetch }) => {
  try {
    const truck = await getTruck(params.id, fetch);
    return { truck };
  } catch (err) {
    console.error('Failed to load truck:', err);
    throw error(err instanceof Error && err.message.includes('404') ? 404 : 500, {
      message: err instanceof Error ? err.message : 'Failed to load truck'
    });
  }
}) satisfies PageLoad; 
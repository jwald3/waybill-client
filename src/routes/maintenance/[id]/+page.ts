import { getMaintenanceLog } from '$lib/api/maintenance';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, fetch }) => {
  try {
    const maintenance = await getMaintenanceLog(params.id, fetch);
    return { maintenance };
  } catch (err) {
    console.error('Failed to load maintenance log:', err);
    throw error(err instanceof Error && err.message.includes('404') ? 404 : 500, {
      message: err instanceof Error ? err.message : 'Failed to load maintenance log'
    });
  }
}) satisfies PageLoad; 
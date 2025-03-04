import { getMaintenanceLog } from '$lib/api/maintenance';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ params }) => {
  try {
    const maintenance = await getMaintenanceLog(params.id);
    return { maintenance };
  } catch (err) {
    throw error(404, {
      message: 'Maintenance record not found'
    });
  }
}) satisfies PageLoad; 
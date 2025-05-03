import { getMaintenanceLog } from '$lib/api/maintenance';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { browser } from '$app/environment';

export const ssr = false;
export const csr = true;

export const load = (async ({ params, fetch }) => {
  if (!browser) {
    return { maintenance: null };
  }

  try {
    const maintenance = await getMaintenanceLog(params.id, fetch);
    return { maintenance };
  } catch (err) {
    console.error('Failed to load maintenance log:', err);

    if (err instanceof Error && err.message.includes('401')) {
      if (browser) {
        window.location.href = '/login';
      }
      return { maintenance: null };
    }
    
    throw error(err instanceof Error && err.message.includes('404') ? 404 : 500, {
      message: err instanceof Error ? err.message : 'Failed to load maintenance log'
    });
  }
}) satisfies PageLoad; 
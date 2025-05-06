import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getTruck } from '$lib/api/trucks';
import { getMaintenanceLogs } from '$lib/api/maintenance';
import { browser } from '$app/environment';
export const ssr = false;
export const csr = true;

export const load = (async ({ params, fetch }) => {
  if (!browser) {
    return { truck: null, maintenanceLogs: [] };
  }

  try {
    const [truck, maintenanceLogs] = await Promise.all([
      getTruck(params.id, fetch),
      getMaintenanceLogs(fetch, params.id)
    ]);
    
    return { 
      truck,
      maintenanceLogs: maintenanceLogs.items
    };
  } catch (err) {
    console.error('Failed to load truck data:', err);
    
    if (err instanceof Error && err.message.includes('401')) {
      if (browser) {
        window.location.href = '/login';
      }
      return { truck: null, maintenanceLogs: [] };
    }
    
    throw error(err instanceof Error && err.message.includes('404') ? 404 : 500, {
      message: err instanceof Error ? err.message : 'Failed to load truck'
    });
  }
}) satisfies PageLoad; 
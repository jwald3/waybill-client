import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getTruck } from '$lib/api/trucks';
import { browser } from '$app/environment';
export const ssr = false;
export const csr = true;

export const load = (async ({ params, fetch }) => {
  if (!browser) {
    return { truck: null };
  }

  try {
    const truck = await getTruck(params.id, fetch);
    return { truck };
  } catch (err) {
    console.error('Failed to load truck:', err);
    
    if (err instanceof Error && err.message.includes('401')) {
      if (browser) {
        window.location.href = '/login';
      }
      return { trip: null };
    }
    
    throw error(err instanceof Error && err.message.includes('404') ? 404 : 500, {
      message: err instanceof Error ? err.message : 'Failed to load truck'
    });
  }
}) satisfies PageLoad; 
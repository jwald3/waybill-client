import { getTrip } from '$lib/api/trips';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { browser } from '$app/environment';

// Force client-side rendering like the trips list page
export const ssr = false;
export const csr = true;

export const load = (async ({ params, fetch }) => {
  // Only fetch on client-side
  if (!browser) {
    return { trip: null };
  }

  try {
    const trip = await getTrip(params.id, fetch);
    return { trip };
  } catch (err) {
    console.error('Failed to load trip:', err);
    
    // Handle auth errors specifically
    if (err instanceof Error && err.message.includes('401')) {
      if (browser) {
        window.location.href = '/login';
      }
      return { trip: null };
    }

    // Handle other errors
    throw error(err instanceof Error && err.message.includes('404') ? 404 : 500, {
      message: err instanceof Error ? err.message : 'Failed to load trip'
    });
  }
}) satisfies PageLoad; 
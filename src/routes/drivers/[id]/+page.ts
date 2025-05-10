import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getDriver } from '$lib/api/drivers';
import { getTrips } from '$lib/api/trips';
import { browser } from '$app/environment';

export const ssr = false;
export const csr = true;

export const load = (async ({ params, fetch, parent }) => {
  if (!browser) {
    return { driver: null, trips: [] };
  }

  try {
    const { token } = await parent();

    const customFetch: typeof fetch = (input, init) => {
      return fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
    };

    const [driver, tripsResponse] = await Promise.all([
      getDriver(params.id, customFetch),
      getTrips(customFetch, undefined, params.id)
    ]);

    return { 
      driver,
      trips: tripsResponse.items
    };
  } catch (err) {
    console.error('Failed to load driver:', err);
    
    if (err instanceof Error && err.message.includes('401')) {
      if (browser) {
        window.location.href = '/login';
      }
      return { driver: null, trips: [] };
    }
    
    throw error(err instanceof Error && err.message.includes('404') ? 404 : 500, {
      message: err instanceof Error ? err.message : 'Failed to load driver'
    });
  }
}) satisfies PageLoad; 
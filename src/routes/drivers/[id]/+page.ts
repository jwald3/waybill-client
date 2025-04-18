import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getDriver } from '$lib/api/drivers';

export const load = (async ({ params, fetch, parent }) => {
  try {
    const { token } = await parent();
    console.log('[Driver Page Load]', { 
      hasToken: !!token,
      driverId: params.id 
    });

    const customFetch: typeof fetch = (input, init) => {
      console.log('[Custom Fetch]', {
        url: typeof input === 'string' ? input : input instanceof Request ? input.url : input.href,
        headers: init?.headers
      });
      return fetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
    };

    const driver = await getDriver(params.id, customFetch);
    return { driver };
  } catch (err) {
    console.error('Failed to load driver:', err);
    throw error(err instanceof Error && err.message.includes('404') ? 404 : 500, {
      message: err instanceof Error ? err.message : 'Failed to load driver'
    });
  }
}) satisfies PageLoad; 
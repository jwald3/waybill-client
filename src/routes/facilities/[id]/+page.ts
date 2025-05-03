import { getFacility } from '$lib/api/facilities';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { browser } from '$app/environment';

export const ssr = false;
export const csr = true;

export const load = (async ({ params, fetch }) => {
  if (!browser) {
    return { facility: null };
  }


  try {
    const facility = await getFacility(params.id, fetch);
    return { facility };
  } catch (err) {
    console.error('Failed to load facility:', err);

    if (err instanceof Error && err.message.includes('401')) {
      if (browser) {
        window.location.href = '/login';
      }
      return { facility: null };
    }

    throw error(err instanceof Error && err.message.includes('404') ? 404 : 500, {
      message: err instanceof Error ? err.message : 'Failed to load facility'
    });
  }
}) satisfies PageLoad; 
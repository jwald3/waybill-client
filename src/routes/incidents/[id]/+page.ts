import { getIncident } from '$lib/api/incidents';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { browser } from '$app/environment';

export const ssr = false;
export const csr = true;

export const load = (async ({ params, fetch }) => {
  if (!browser) {
    return { incident: null };
  }

  try {
    const incident = await getIncident(params.id, fetch);
    return { incident };
  } catch (err) {
    console.error('Failed to load incident:', err);

    if (err instanceof Error && err.message.includes('401')) {
      if (browser) {
        window.location.href = '/login';
      }
      return { incident: null };
    }

    throw error(err instanceof Error && err.message.includes('404') ? 404 : 500, {
      message: err instanceof Error ? err.message : 'Failed to load incident'
    });
  }
}) satisfies PageLoad; 
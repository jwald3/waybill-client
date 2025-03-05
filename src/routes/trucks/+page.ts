import type { PageLoad } from './$types';
import { getTrucks } from '$lib/api/trucks';

export const load = (async ({ fetch }) => {
  const trucksResponse = await getTrucks(fetch);
  return {
    trucks: trucksResponse.items
  };
}) satisfies PageLoad;
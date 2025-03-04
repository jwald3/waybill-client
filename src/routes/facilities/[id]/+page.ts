import { getFacility } from '$lib/api/facilities';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  try {
    const facility = await getFacility(params.id);
    return {
      facility
    };
  } catch (error) {
    console.error('Error loading facility:', error);
    return {
      facility: null
    };
  }
}; 
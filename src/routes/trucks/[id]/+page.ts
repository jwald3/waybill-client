import { getTruck } from '$lib/api/trucks';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
  try {
    const truck = await getTruck(params.id);
    return {
      truck
    };
  } catch (error) {
    console.error('Error loading truck:', error);
    return {
      truck: null
    };
  }
}; 
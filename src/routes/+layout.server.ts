import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ url, cookies }) => {
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.includes(url.pathname);
  
  const token = cookies.get('auth_token');
  if (!token && !isPublicPath) {
    throw redirect(307, '/login');
  }
  return { token };
}) satisfies LayoutServerLoad; 
import { isAuthenticated } from '$lib/stores/auth';
import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.includes(url.pathname);
  
  if (browser) {
    isAuthenticated.initialize();
    const token = localStorage.getItem('auth_token');
    if (!token && !isPublicPath) {
      throw redirect(307, '/login');
    }
    return { token };
  }
  
  return { token: null };
}; 
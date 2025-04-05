import { isAuthenticated } from '$lib/stores/auth';
import { browser } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load = (async ({ url, data }) => {
  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.includes(url.pathname);
  
  console.log('[Layout Load]', {
    browser,
    isPublicPath,
    pathname: url.pathname,
    token: browser ? localStorage.getItem('auth_token') : 'server-side'
  });
  
  if (browser) {
    isAuthenticated.initialize();
    const token = localStorage.getItem('auth_token');
    if (!token && !isPublicPath) {
      throw redirect(307, '/login');
    }
    // Sync token to cookie for SSR
    if (token) {
      document.cookie = `auth_token=${token}; path=/`;
    }
    return { token };
  }
  
  return data;
}) satisfies LayoutLoad; 
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createAuthStore() {
  const { subscribe, set } = writable<boolean>(false);

  // Initialize the store value if we're in the browser
  if (browser) {
    set(!!localStorage.getItem('auth_token'));
  }

  return {
    subscribe,
    login: (token: string) => {
      if (browser) {
        localStorage.setItem('auth_token', token);
        set(true);
      }
    },
    logout: () => {
      if (browser) {
        localStorage.removeItem('auth_token');
        set(false);
        window.location.href = '/login';
      }
    },
    initialize: () => {
      if (browser) {
        set(!!localStorage.getItem('auth_token'));
      }
    }
  };
}

export const isAuthenticated = createAuthStore(); 
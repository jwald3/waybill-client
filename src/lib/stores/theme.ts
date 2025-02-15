import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'indigo' | 'emerald' | 'rose' | 'amber';

const defaultTheme: Theme = 'indigo';

// Get initial theme from localStorage or use default
const initialTheme = browser ? 
  (localStorage.getItem('theme') as Theme || defaultTheme) : 
  defaultTheme;

export const theme = writable<Theme>(initialTheme);

// Update localStorage when theme changes
if (browser) {
  theme.subscribe(value => {
    localStorage.setItem('theme', value);
    document.documentElement.setAttribute('data-theme', value);
  });
} 
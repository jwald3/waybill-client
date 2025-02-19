import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'indigo' | 'emerald' | 'rose' | 'amber';
export type ColorMode = 'light' | 'dark';

const defaultTheme: Theme = 'indigo';
const defaultColorMode: ColorMode = 'light';

// Get initial values from localStorage or use defaults
const initialTheme = browser ? 
  (localStorage.getItem('theme') as Theme || defaultTheme) : 
  defaultTheme;

const initialColorMode = browser ?
  (localStorage.getItem('colorMode') as ColorMode || defaultColorMode) :
  defaultColorMode;

export const theme = writable<Theme>(initialTheme);
export const colorMode = writable<ColorMode>(initialColorMode);

// Update localStorage when theme or colorMode changes
if (browser) {
  theme.subscribe(value => {
    localStorage.setItem('theme', value);
    document.documentElement.setAttribute('data-theme', value);
  });

  colorMode.subscribe(value => {
    localStorage.setItem('colorMode', value);
    document.documentElement.setAttribute('data-color-mode', value);
  });
} 
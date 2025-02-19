import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'indigo' | 'emerald' | 'rose' | 'amber';
export type ColorMode = 'light' | 'dark';

// Define interface for theme variables
export interface ThemeVariables {
  'bg-primary': string;
  'bg-secondary': string;
  'text-primary': string;
  'text-secondary': string;
  'border-color': string;
  'surface-color': string;
  'theme-color': string;
  'theme-gradient': string;
}

// Define theme configurations
export const themeConfig: Record<ColorMode, ThemeVariables> = {
  light: {
    'bg-primary': '#f0f4ff',
    'bg-secondary': '#ffffff',
    'text-primary': '#1e293b',
    'text-secondary': '#64748b',
    'border-color': '#e2e8f0',
    'surface-color': '#f8fafc',
    'theme-color': '#6366f1',
    'theme-gradient': 'linear-gradient(90deg, #6366f1, #818cf8)'
  },
  dark: {
    'bg-primary': '#0f172a',
    'bg-secondary': '#1e293b',
    'text-primary': '#e2e8f0',
    'text-secondary': '#94a3b8',
    'border-color': '#334155',
    'surface-color': '#1e293b',
    'theme-color': '#818cf8',
    'theme-gradient': 'linear-gradient(90deg, #818cf8, #6366f1)'
  }
};

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

// Update localStorage and apply theme variables when theme or colorMode changes
if (browser) {
  theme.subscribe(value => {
    localStorage.setItem('theme', value);
    document.documentElement.setAttribute('data-theme', value);
  });

  colorMode.subscribe(value => {
    localStorage.setItem('colorMode', value);
    document.documentElement.setAttribute('data-color-mode', value);
    
    // Apply theme variables
    const variables = themeConfig[value];
    Object.entries(variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  });
} 
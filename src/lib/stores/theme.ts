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

// Define color theme configurations
export const colorThemes: Record<Theme, { light: string; dark: string; gradient: string }> = {
  indigo: {
    light: '#6366f1',
    dark: '#818cf8',
    gradient: 'linear-gradient(90deg, #6366f1, #818cf8)'
  },
  emerald: {
    light: '#10b981',
    dark: '#34d399',
    gradient: 'linear-gradient(90deg, #10b981, #34d399)'
  },
  rose: {
    light: '#f43f5e',
    dark: '#fb7185',
    gradient: 'linear-gradient(90deg, #f43f5e, #fb7185)'
  },
  amber: {
    light: '#f59e0b',
    dark: '#fbbf24',
    gradient: 'linear-gradient(90deg, #f59e0b, #fbbf24)'
  }
};

// Define base theme configurations
export const baseThemeConfig: Record<ColorMode, Omit<ThemeVariables, 'theme-color' | 'theme-gradient'>> = {
  light: {
    'bg-primary': '#f0f4ff',
    'bg-secondary': '#ffffff',
    'text-primary': '#1e293b',
    'text-secondary': '#64748b',
    'border-color': '#e2e8f0',
    'surface-color': '#f8fafc'
  },
  dark: {
    'bg-primary': '#0f172a',
    'bg-secondary': '#1e293b',
    'text-primary': '#e2e8f0',
    'text-secondary': '#94a3b8',
    'border-color': '#334155',
    'surface-color': '#1e293b'
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

// Make getThemeVariables exportable
export function getThemeVariables(mode: ColorMode, selectedTheme: Theme): ThemeVariables {
  const baseVariables = baseThemeConfig[mode];
  const themeColors = colorThemes[selectedTheme];
  
  return {
    ...baseVariables,
    'theme-color': mode === 'light' ? themeColors.light : themeColors.dark,
    'theme-gradient': themeColors.gradient
  };
}

// Update localStorage and apply theme variables when theme or colorMode changes
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
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Create a writable store with initial value from localStorage, defaulting to true
export const sidebarExpanded = writable(
  browser ? localStorage.getItem('sidebarExpanded') !== 'false' : true
);

// Subscribe to changes and update localStorage
if (browser) {
  sidebarExpanded.subscribe(value => {
    localStorage.setItem('sidebarExpanded', value.toString());
  });
} 
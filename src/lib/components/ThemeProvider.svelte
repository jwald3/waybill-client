<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { colorMode, theme, type ColorMode, type Theme, getThemeVariables } from '$lib/stores/theme';
  
  // Function to apply theme variables
  function applyThemeVariables(mode: ColorMode, currentTheme: Theme) {
    if (!browser) return;
    
    const variables = getThemeVariables(mode, currentTheme);
    Object.entries(variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }

  // Subscribe to both theme and colorMode changes
  $: if (browser) {
    applyThemeVariables($colorMode, $theme);
  }

  onMount(() => {
    // Apply initial theme variables
    applyThemeVariables($colorMode, $theme);
  });
</script>

<slot /> 
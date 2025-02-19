<script lang="ts">
  import { onMount } from 'svelte';
  import { colorMode, type ColorMode, themeConfig } from '$lib/stores/theme';
  
  // Function to apply theme variables
  function applyThemeVariables(mode: ColorMode) {
    const variables = themeConfig[mode];
    Object.entries(variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }

  onMount(() => {
    // Apply initial theme variables
    applyThemeVariables($colorMode);
  });
</script>

<slot /> 
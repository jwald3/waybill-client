<script lang="ts">
  import { colorMode } from '$lib/stores/theme';

  function toggleColorMode() {
    $colorMode = $colorMode === 'light' ? 'dark' : 'light';
  }
</script>

<button 
  class="theme-toggle" 
  on:click={toggleColorMode} 
  aria-label="Toggle color mode"
>
  {#if $colorMode === 'light'}
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z"/>
    </svg>
  {:else}
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-13L7 6v2h10V6l-5-4z"/>
    </svg>
  {/if}
</button>

<style>
  .theme-toggle {
    padding: 0.5rem;
    border-radius: 8px;
    color: var(--text-secondary);
    background: var(--surface-color);
    border: 1px solid var(--border-color);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .theme-toggle:hover {
    color: var(--theme-color);
    border-color: var(--theme-color);
  }
</style> 
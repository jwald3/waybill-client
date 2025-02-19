<script lang="ts">
  import { icons } from '$lib/icons';
  import { page } from '$app/stores';
  import ThemeToggle from './ThemeToggle.svelte';
  export let isNavExpanded = true;
</script>

<div class="layout">
  <nav class:expanded={isNavExpanded}>
    <div class="nav-header">
      <button class="toggle-nav" on:click={() => isNavExpanded = !isNavExpanded}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      </button>
      {#if isNavExpanded}
        <h1>Waybill</h1>
        <div class="nav-tools">
          <ThemeToggle />
        </div>
      {/if}
    </div>

    <div class="nav-links">
      <a href="/" class="nav-link" class:active={$page.url.pathname === "/"}>
        <span class="nav-icon">{@html icons.dashboard}</span>
        {#if isNavExpanded}<span>Dashboard</span>{/if}
      </a>
      <a href="/routes" class="nav-link" class:active={$page.url.pathname === "/routes"}>
        <span class="nav-icon">{@html icons.routes}</span>
        {#if isNavExpanded}<span>Routes</span>{/if}
      </a>
      <a href="/analytics" class="nav-link" class:active={$page.url.pathname === "/analytics"}>
        <span class="nav-icon">{@html icons.analytics}</span>
        {#if isNavExpanded}<span>Analytics</span>{/if}
      </a>
      <a href="/settings" class="nav-link" class:active={$page.url.pathname === "/settings"}>
        <span class="nav-icon">{@html icons.settings}</span>
        {#if isNavExpanded}<span>Settings</span>{/if}
      </a>
    </div>
  </nav>

  <main>
    <slot />
  </main>
</div>

<style>
  .layout {
    display: flex;
    min-height: 100vh;
  }

  nav {
    width: 280px;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-color);
    transition: width 0.3s ease;
  }

  nav.expanded {
    width: 280px;
  }

  .nav-header {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    border-bottom: 1px solid var(--border-color);
    position: relative;
  }

  .nav-header h1 {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text-primary);
    white-space: nowrap;
  }

  .toggle-nav {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .toggle-nav:hover {
    background: var(--surface-color);
    color: var(--text-primary);
  }

  .nav-links {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    color: var(--text-secondary);
    text-decoration: none;
    border-radius: 12px;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .nav-link:hover {
    background: var(--surface-color);
    color: var(--text-primary);
  }

  .nav-link.active {
    background: color-mix(in srgb, var(--theme-color) 15%, transparent);
    color: var(--theme-color);
  }

  .nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  main {
    flex: 1;
    background: var(--bg-primary);
  }

  @media (max-width: 768px) {
    nav {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: auto;
      border-right: none;
      border-top: 1px solid var(--border-color);
      z-index: 100;
    }

    nav.expanded {
      width: 100%;
    }

    .nav-header {
      display: none;
    }

    .nav-links {
      flex-direction: row;
      justify-content: space-around;
      padding: 0.5rem;
    }

    .nav-link {
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.75rem;
      font-size: 0.8rem;
    }

    main {
      padding-bottom: 80px;
    }
  }

  /* Add theme styles for active navigation items */
  :global(.nav-item.active) {
    background: color-mix(in srgb, var(--theme-color) 15%, transparent);
    color: var(--theme-color);
  }

  :global(.nav-item:hover) {
    background: color-mix(in srgb, var(--theme-color) 10%, transparent);
  }

  .nav-tools {
    position: absolute;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
  }
</style> 
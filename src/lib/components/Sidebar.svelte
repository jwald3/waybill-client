<script lang="ts">
  import { icons } from '$lib/icons';
  import { page } from '$app/stores';
  import ThemeToggle from './ThemeToggle.svelte';
  
  export let isExpanded = true;
  let isMoreMenuOpen = false;
</script>

<nav class:expanded={isExpanded}>
  <div class="nav-header">
    <button class="toggle-nav" on:click={() => isExpanded = !isExpanded}>
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
      </svg>
    </button>
    {#if isExpanded}
      <h1>Waybill</h1>
      <div class="nav-tools">
        <ThemeToggle />
      </div>
    {/if}
  </div>

  <div class="nav-links">
    <!-- Primary navigation items -->
    <a href="/" class="nav-link primary-nav" class:active={$page.url.pathname === "/"}>
      <span class="nav-icon">{@html icons.dashboard}</span>
      {#if isExpanded}<span>Dashboard</span>{/if}
    </a>
    <a href="/trips" class="nav-link primary-nav" class:active={$page.url.pathname === "/trips"}>
      <span class="nav-icon">{@html icons.trips}</span>
      {#if isExpanded}<span>Trips</span>{/if}
    </a>
    <a href="/drivers" class="nav-link primary-nav" class:active={$page.url.pathname === "/drivers"}>
      <span class="nav-icon">{@html icons.drivers}</span>
      {#if isExpanded}<span>Drivers</span>{/if}
    </a>
    <a href="/trucks" class="nav-link primary-nav" class:active={$page.url.pathname === "/trucks"}>
      <span class="nav-icon">{@html icons.truck}</span>
      {#if isExpanded}<span>Trucks</span>{/if}
    </a>
    
    <!-- More menu for mobile -->
    <button 
      class="nav-link primary-nav more-menu-button" 
      on:click={() => isMoreMenuOpen = !isMoreMenuOpen}
      aria-label="More menu"
    >
      <span class="nav-icon">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      </span>
      {#if isExpanded}<span>More</span>{/if}
    </button>

    <!-- Secondary navigation items -->
    <div class="secondary-nav" class:show={isMoreMenuOpen}>
      <div class="more-menu">
        <a href="/routes" class="nav-link" class:active={$page.url.pathname === "/routes"}>
          <span class="nav-icon">{@html icons.routes}</span>
          <span>Routes</span>
        </a>
        <a href="/maintenance" class="nav-link" class:active={$page.url.pathname === "/maintenance"}>
          <span class="nav-icon">{@html icons.maintenance}</span>
          <span>Maintenance</span>
        </a>
        <a href="/analytics" class="nav-link" class:active={$page.url.pathname === "/analytics"}>
          <span class="nav-icon">{@html icons.analytics}</span>
          <span>Analytics</span>
        </a>
        <a href="/settings" class="nav-link" class:active={$page.url.pathname === "/settings"}>
          <span class="nav-icon">{@html icons.settings}</span>
          <span>Settings</span>
        </a>
        <a href="/facilities" class="nav-link" class:active={$page.url.pathname === "/facilities"}>
          <span class="nav-icon">{@html icons.facilities}</span>
          <span>Facilities</span>
        </a>
        <a href="/incidents" class="nav-link" class:active={$page.url.pathname === "/incidents"}>
          <span class="nav-icon">{@html icons.incidents}</span>
          <span>Incidents</span>
        </a>
      </div>
    </div>
  </div>
</nav>

<style>
  nav {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 80px;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border-color);
    transition: width 0.3s ease;
    z-index: 10;
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

  .nav-tools {
    position: absolute;
    right: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
  }

  .more-menu-button {
    background: none;
    border: none;
    width: 100%;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    nav {
      position: fixed;
      top: auto;
      bottom: 0;
      left: 0;
      width: 100%;
      height: auto;
      border-right: none;
      border-top: 1px solid var(--border-color);
      background: var(--bg-primary);
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
      padding: 0.5rem 1rem;
      gap: 0;
    }

    .nav-link {
      flex: 1;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.5rem;
      font-size: 0.75rem;
      justify-content: center;
    }

    .nav-icon {
      margin: 0 auto;
    }

    .secondary-nav {
      display: none;
      position: fixed;
      bottom: 64px;
      left: 0;
      width: 100%;
      background: var(--bg-primary);
      border-top: 1px solid var(--border-color);
      padding: 0.5rem;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    }

    .secondary-nav.show {
      display: block;
    }

    .more-menu {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-height: 300px;
      overflow-y: auto;
    }

    .more-menu .nav-link {
      flex-direction: row;
      padding: 0.75rem;
      font-size: 0.875rem;
      justify-content: flex-start;
    }

    .more-menu .nav-icon {
      margin: 0;
    }

    .more-menu .nav-link {
      display: flex;
    }
  }
</style> 
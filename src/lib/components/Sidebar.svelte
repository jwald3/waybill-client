<script lang="ts">
  import { icons } from '$lib/icons';
  import { page } from '$app/stores';
  import { sidebarExpanded } from '$lib/stores/sidebar';
  import ThemeToggle from './ThemeToggle.svelte';
  import { isAuthenticated } from '$lib/stores/auth';
  
  let isMoreMenuOpen = false;
</script>

<nav class:expanded={$sidebarExpanded}>
  <div class="nav-header">
    <button 
      class="toggle-nav" 
      on:click={() => $sidebarExpanded = !$sidebarExpanded}
      aria-label={$sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
      </svg>
    </button>
    {#if $sidebarExpanded}
      <h1>Waybill</h1>
      <div class="nav-tools">
        <ThemeToggle />
      </div>
    {/if}
  </div>

  <div class="sidebar-content">
    <div class="nav-links">
      <!-- Primary navigation items -->
      <a 
        href="/" 
        class="nav-link primary-nav" 
        class:active={$page.url.pathname === "/"}
        aria-label={$sidebarExpanded ? undefined : "Dashboard"}
      >
        <span class="nav-icon">{@html icons.dashboard}</span>
        {#if $sidebarExpanded}<span>Dashboard</span>{/if}
      </a>
      <a 
        href="/trips" 
        class="nav-link primary-nav" 
        class:active={$page.url.pathname === "/trips"}
        aria-label={$sidebarExpanded ? undefined : "Trips"}
      >
        <span class="nav-icon">{@html icons.trips}</span>
        {#if $sidebarExpanded}<span>Trips</span>{/if}
      </a>
      <a 
        href="/drivers" 
        class="nav-link primary-nav" 
        class:active={$page.url.pathname === "/drivers"}
        aria-label={$sidebarExpanded ? undefined : "Drivers"}
      >
        <span class="nav-icon">{@html icons.drivers}</span>
        {#if $sidebarExpanded}<span>Drivers</span>{/if}
      </a>
      <a 
        href="/trucks" 
        class="nav-link primary-nav" 
        class:active={$page.url.pathname === "/trucks"}
        aria-label={$sidebarExpanded ? undefined : "Trucks"}
      >
        <span class="nav-icon">{@html icons.truck}</span>
        {#if $sidebarExpanded}<span>Trucks</span>{/if}
      </a>
      
      <!-- Desktop secondary navigation -->
      <div class="desktop-secondary-nav">
        <a 
          href="/maintenance" 
          class="nav-link" 
          class:active={$page.url.pathname === "/maintenance"}
          aria-label={$sidebarExpanded ? undefined : "Maintenance"}
        >
          <span class="nav-icon">{@html icons.maintenance}</span>
          {#if $sidebarExpanded}<span>Maintenance</span>{/if}
        </a>
        <a 
          href="/analytics" 
          class="nav-link" 
          class:active={$page.url.pathname === "/analytics"}
          aria-label={$sidebarExpanded ? undefined : "Analytics"}
        >
          <span class="nav-icon">{@html icons.analytics}</span>
          {#if $sidebarExpanded}<span>Analytics</span>{/if}
        </a>
        <a 
          href="/settings" 
          class="nav-link" 
          class:active={$page.url.pathname === "/settings"}
          aria-label={$sidebarExpanded ? undefined : "Settings"}
        >
          <span class="nav-icon">{@html icons.settings}</span>
          {#if $sidebarExpanded}<span>Settings</span>{/if}
        </a>
        <a 
          href="/facilities" 
          class="nav-link" 
          class:active={$page.url.pathname === "/facilities"}
          aria-label={$sidebarExpanded ? undefined : "Facilities"}
        >
          <span class="nav-icon">{@html icons.facilities}</span>
          {#if $sidebarExpanded}<span>Facilities</span>{/if}
        </a>
        <a 
          href="/incidents" 
          class="nav-link" 
          class:active={$page.url.pathname === "/incidents"}
          aria-label={$sidebarExpanded ? undefined : "Incidents"}
        >
          <span class="nav-icon">{@html icons.incidents}</span>
          {#if $sidebarExpanded}<span>Incidents</span>{/if}
        </a>
      </div>
      
      <!-- Mobile more menu button and secondary nav -->
      <div class="mobile-nav">
        <button 
          class="nav-link primary-nav more-menu-button" 
          on:click={() => isMoreMenuOpen = !isMoreMenuOpen}
          aria-label="More menu"
          aria-expanded={isMoreMenuOpen}
          aria-controls="secondary-nav-menu"
        >
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </span>
          {#if $sidebarExpanded}<span>More</span>{/if}
        </button>

        <div 
          id="secondary-nav-menu"
          class="secondary-nav" 
          class:show={isMoreMenuOpen}
        >
          <div class="more-menu">
            <a 
              href="/maintenance" 
              class="nav-link" 
              class:active={$page.url.pathname === "/maintenance"}
              aria-label={$sidebarExpanded ? undefined : "Maintenance"}
            >
              <span class="nav-icon">{@html icons.maintenance}</span>
              <span>Maintenance</span>
            </a>
            <a 
              href="/analytics" 
              class="nav-link" 
              class:active={$page.url.pathname === "/analytics"}
              aria-label={$sidebarExpanded ? undefined : "Analytics"}
            >
              <span class="nav-icon">{@html icons.analytics}</span>
              <span>Analytics</span>
            </a>
            <a 
              href="/settings" 
              class="nav-link" 
              class:active={$page.url.pathname === "/settings"}
              aria-label={$sidebarExpanded ? undefined : "Settings"}
            >
              <span class="nav-icon">{@html icons.settings}</span>
              <span>Settings</span>
            </a>
            <a 
              href="/facilities" 
              class="nav-link" 
              class:active={$page.url.pathname === "/facilities"}
              aria-label={$sidebarExpanded ? undefined : "Facilities"}
            >
              <span class="nav-icon">{@html icons.facilities}</span>
              <span>Facilities</span>
            </a>
            <a 
              href="/incidents" 
              class="nav-link" 
              class:active={$page.url.pathname === "/incidents"}
              aria-label={$sidebarExpanded ? undefined : "Incidents"}
            >
              <span class="nav-icon">{@html icons.incidents}</span>
              <span>Incidents</span>
            </a>

            <!-- Add login link to more menu -->
            {#if $isAuthenticated}
              <button 
                class="nav-link" 
                on:click={() => isAuthenticated.logout()}
                aria-label={$sidebarExpanded ? undefined : "Logout"}
              >
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                  </svg>
                </span>
                {#if $sidebarExpanded}<span>Logout</span>{/if}
              </button>
            {:else}
              <a 
                href="/login" 
                class="nav-link" 
                class:active={$page.url.pathname === "/login"}
                aria-label={$sidebarExpanded ? undefined : "Login"}
              >
                <span class="nav-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </span>
                {#if $sidebarExpanded}<span>Login / Register</span>{/if}
              </a>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- Login/Register link -->
    <div class="auth-nav">
      {#if $isAuthenticated}
        <button 
          class="nav-link" 
          on:click={() => isAuthenticated.logout()}
          aria-label={$sidebarExpanded ? undefined : "Logout"}
        >
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
          </span>
          {#if $sidebarExpanded}<span>Logout</span>{/if}
        </button>
      {:else}
        <a 
          href="/login" 
          class="nav-link" 
          class:active={$page.url.pathname === "/login"}
          aria-label={$sidebarExpanded ? undefined : "Login"}
        >
          <span class="nav-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </span>
          {#if $sidebarExpanded}<span>Login / Register</span>{/if}
        </a>
      {/if}
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
    display: flex;
    flex-direction: column;
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

  .sidebar-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-y: auto;
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

  /* Update the nav-link styles when sidebar is not expanded */
  nav:not(.expanded) .nav-link {
    width: 48px;
    height: 48px;
    padding: 0;
    margin: 0 auto;
    justify-content: center;
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
    width: 24px;
    height: 24px;
    flex-shrink: 0;
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

  .desktop-secondary-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .mobile-nav {
    display: none;
  }

  .auth-nav {
    padding: 1rem;
    border-top: 1px solid var(--border-color);
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
      width: auto;
      height: auto;
    }

    /* Reset the collapsed nav-link styles for mobile */
    nav:not(.expanded) .nav-link {
      width: auto;
      height: auto;
      padding: 0.5rem;
      margin: 0;
    }

    .nav-icon {
      margin: 0 auto;
    }

    .desktop-secondary-nav {
      display: none;
    }

    .mobile-nav {
      display: block;
    }

    .more-menu-button {
      background: none;
      border: none;
      width: 100%;
      cursor: pointer;
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

    .sidebar-content {
      flex-direction: row;
    }

    .auth-nav {
      display: none;
    }
  }
</style> 
<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import { theme, type Theme, colorMode, getThemeVariables } from '$lib/stores/theme';
  
  let isNavExpanded = true;
  
  const themes: { value: Theme; label: string; }[] = [
    { value: 'indigo', label: 'Indigo (Default)' },
    { value: 'emerald', label: 'Emerald' },
    { value: 'rose', label: 'Rose' },
    { value: 'amber', label: 'Amber' }
  ];

  function handleThemeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    theme.set(select.value as Theme);
  }

  function toggleColorMode() {
    colorMode.set($colorMode === 'light' ? 'dark' : 'light');
  }
</script>

<svelte:head>
  <title>Settings | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    <h1 class="page-title">Settings</h1>

    <div class="settings-grid">
      <Card title="Account Settings" icon={icons.settings}>
        <div class="settings-section">
          <div class="setting-item">
            <div class="setting-info">
              <h3>Profile Information</h3>
              <p>Update your account details and preferences</p>
            </div>
            <button class="action-button">Edit</button>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3>Notification Preferences</h3>
              <p>Manage your notification settings</p>
            </div>
            <button class="action-button">Configure</button>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Security Settings</h3>
              <p>Update password and security preferences</p>
            </div>
            <button class="action-button">Manage</button>
          </div>
        </div>
      </Card>

      <Card title="System Preferences" icon={icons.dashboard}>
        <div class="settings-section">
          <div class="setting-item">
            <div class="setting-info">
              <h3>Display Settings</h3>
              <p>Customize your dashboard appearance</p>
            </div>
            <button class="action-button">Customize</button>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Data Preferences</h3>
              <p>Manage data display and exports</p>
            </div>
            <button class="action-button">Configure</button>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Color Theme</h3>
              <p>Choose your preferred color scheme</p>
            </div>
            <select 
              class="theme-select" 
              value={$theme} 
              on:change={handleThemeChange}
            >
              {#each themes as themeOption}
                <option value={themeOption.value}>{themeOption.label}</option>
              {/each}
            </select>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Dark Mode</h3>
              <p>Toggle between light and dark interface</p>
            </div>
            <button 
              class="mode-toggle" 
              on:click={toggleColorMode}
              class:dark={$colorMode === 'dark'}
            >
              <span class="toggle-slider"></span>
              <span class="toggle-text">{$colorMode === 'light' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</Layout>

<style>
  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: var(--spacing-xl);
    max-width: 1200px;
    margin: 0 auto;
  }

  .settings-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    padding: var(--spacing-xl);
    max-width: 600px;
    margin: 0 auto;
  }

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-lg) var(--spacing-xl);
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    transition: var(--transition-all);
    border: 1px solid var(--border-color);
    position: relative;
    max-width: 100%;
    box-shadow: var(--shadow-sm);
  }

  .setting-item:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: calc(-1 * var(--spacing-xl));
    left: 0;
    right: 0;
    height: 1px;
    background: var(--border-color);
    opacity: 0.3;
  }

  .setting-item:hover {
    background: color-mix(in srgb, var(--theme-color) 2%, var(--bg-secondary));
    border-color: var(--theme-color);
    transform: translateX(4px);
    box-shadow: var(--shadow-md);
  }

  .setting-info {
    flex: 1;
    padding-right: var(--spacing-xl);
    max-width: 75%;
  }

  .setting-info h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
    letter-spacing: -0.01em;
    line-height: 1.3;
  }

  .setting-info p {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    line-height: 1.5;
    opacity: 0.9;
    max-width: 32ch;
  }

  .action-button {
    padding: var(--spacing-sm) var(--spacing-md);
    min-width: 70px;
    width: auto;
    height: 36px;
    font-size: var(--font-size-sm);
    background: color-mix(in srgb, var(--theme-color) 5%, var(--bg-secondary));
    border: 1px solid color-mix(in srgb, var(--theme-color) 15%, var(--border-color));
    border-radius: var(--radius-md);
    color: var(--theme-color);
    font-weight: 500;
    letter-spacing: 0.01em;
    transition: var(--transition-all);
    cursor: pointer;
    white-space: nowrap;
  }

  .action-button:hover {
    background: var(--theme-color);
    border-color: var(--theme-color);
    color: white;
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }

  .theme-select {
    padding: var(--spacing-sm) var(--spacing-md);
    min-width: 140px;
    width: auto;
    height: 36px;
    background: color-mix(in srgb, var(--theme-color) 5%, var(--bg-secondary));
    border: 1px solid color-mix(in srgb, var(--theme-color) 15%, var(--border-color));
    border-radius: var(--radius-md);
    color: var(--text-primary);
    font-weight: 500;
    font-size: var(--font-size-sm);
    cursor: pointer;
    transition: var(--transition-all);
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right var(--spacing-sm) center;
    padding-right: var(--spacing-xl);
  }

  .theme-select:hover {
    border-color: var(--theme-color);
    background: color-mix(in srgb, var(--theme-color) 8%, var(--bg-secondary));
    box-shadow: var(--shadow-sm);
  }

  .mode-toggle {
    position: relative;
    width: 80px;
    height: 36px;
    background: color-mix(in srgb, var(--theme-color) 5%, var(--bg-secondary));
    border: 1px solid color-mix(in srgb, var(--theme-color) 15%, var(--border-color));
    border-radius: var(--radius-xl);
    cursor: pointer;
    padding: var(--spacing-xs);
    transition: var(--transition-all);
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .mode-toggle:hover {
    border-color: var(--theme-color);
    background: color-mix(in srgb, var(--theme-color) 8%, var(--bg-secondary));
    box-shadow: var(--shadow-sm);
  }

  .toggle-slider {
    position: absolute;
    width: 28px;
    height: 28px;
    background: var(--theme-color);
    border-radius: 50%;
    transition: var(--transition-all);
    left: 4px;
    box-shadow: var(--shadow-sm);
  }

  .mode-toggle.dark .toggle-slider {
    transform: translateX(44px);
  }

  .toggle-text {
    color: var(--text-primary);
    font-size: var(--font-size-sm);
    font-weight: 500;
    margin-left: 36px;
    transition: var(--transition-all);
    opacity: 0.9;
    letter-spacing: 0.01em;
  }

  .mode-toggle.dark .toggle-text {
    margin-left: 12px;
  }

  @media (max-width: 768px) {
    .settings-grid {
      grid-template-columns: 1fr;
      gap: var(--spacing-lg);
    }

    .settings-section {
      padding: var(--spacing-lg);
      gap: var(--spacing-lg);
    }

    .setting-item {
      padding: var(--spacing-lg);
      gap: var(--spacing-lg);
    }

    .setting-item:not(:last-child)::after {
      bottom: calc(-1 * var(--spacing-lg));
    }

    .setting-info {
      padding-right: var(--spacing-lg);
      max-width: 70%;
    }

    .setting-info h3 {
      font-size: var(--font-size-md);
      margin-bottom: var(--spacing-xs);
    }

    .setting-info p {
      max-width: 28ch;
    }

    .action-button,
    .theme-select {
      width: auto;
      min-width: 90px;
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: var(--font-size-sm);
      height: 42px;
      white-space: nowrap;
    }

    .mode-toggle {
      width: 90px;
      height: 36px;
      padding: var(--spacing-xs);
    }

    .toggle-slider {
      width: 28px;
      height: 28px;
    }

    .mode-toggle.dark .toggle-slider {
      transform: translateX(54px);
    }

    .toggle-text {
      font-size: var(--font-size-sm);
      margin: 0 auto;
    }

    .setting-item:hover {
      transform: none;
      background: var(--bg-secondary);
      border-color: var(--theme-color);
    }
  }
</style> 
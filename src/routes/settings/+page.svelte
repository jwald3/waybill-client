<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import { theme, type Theme, colorMode } from '$lib/stores/theme';
  
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
    $colorMode = $colorMode === 'light' ? 'dark' : 'light';
  }
</script>

<Layout {isNavExpanded}>
  <div class="settings">
    <h1 class="settings-title">Settings</h1>

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
              {#each themes as theme}
                <option value={theme.value}>{theme.label}</option>
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
  .settings {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .settings-title {
    font-size: 3rem;
    margin-bottom: 3rem;
    color: var(--text-primary);
    font-weight: 800;
    position: relative;
    letter-spacing: -1px;
  }

  .settings-title::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 100px;
    height: 6px;
    background: var(--theme-gradient);
    border-radius: 3px;
  }

  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
  }

  .settings-section {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.5rem;
  }

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem;
    background: var(--bg-secondary);
    border-radius: 12px;
    transition: all 0.2s ease;
    border: 1px solid transparent;
    position: relative;
  }

  .setting-item:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: -0.625rem;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--border-color);
    opacity: 0.5;
  }

  .setting-item:hover {
    background: color-mix(in srgb, var(--theme-color) 2%, var(--surface-color));
    border-color: color-mix(in srgb, var(--theme-color) 15%, var(--border-color));
    transform: translateX(4px);
  }

  .setting-info {
    flex: 1;
    padding-right: 1.5rem;
  }

  .setting-info h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.375rem;
  }

  .setting-info p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .action-button {
    padding: 0.625rem 1.25rem;
    background: color-mix(in srgb, var(--theme-color) 5%, var(--bg-secondary));
    border: 1px solid color-mix(in srgb, var(--theme-color) 15%, var(--border-color));
    border-radius: 8px;
    color: var(--theme-color);
    font-weight: 500;
    transition: all 0.2s ease;
    cursor: pointer;
    white-space: nowrap;
  }

  .action-button:hover {
    background: var(--theme-color);
    border-color: var(--theme-color);
    color: white;
    transform: translateY(-2px);
  }

  .theme-select {
    padding: 0.625rem 1.25rem;
    background: color-mix(in srgb, var(--theme-color) 5%, var(--bg-secondary));
    border: 1px solid color-mix(in srgb, var(--theme-color) 15%, var(--border-color));
    border-radius: 8px;
    color: var(--text-primary);
    font-weight: 500;
    cursor: pointer;
    min-width: 160px;
    transition: all 0.2s ease;
  }

  .theme-select:hover {
    border-color: var(--theme-color);
    background: color-mix(in srgb, var(--theme-color) 8%, var(--bg-secondary));
  }

  .mode-toggle {
    position: relative;
    width: 110px;
    height: 38px;
    background: color-mix(in srgb, var(--theme-color) 5%, var(--bg-secondary));
    border: 1px solid color-mix(in srgb, var(--theme-color) 15%, var(--border-color));
    border-radius: 19px;
    cursor: pointer;
    padding: 4px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
  }

  .mode-toggle:hover {
    border-color: var(--theme-color);
    background: color-mix(in srgb, var(--theme-color) 8%, var(--bg-secondary));
  }

  .toggle-slider {
    position: absolute;
    width: 28px;
    height: 28px;
    background: var(--theme-color);
    border-radius: 50%;
    transition: transform 0.3s ease;
    left: 4px;
  }

  .mode-toggle.dark .toggle-slider {
    transform: translateX(64px);
  }

  .toggle-text {
    color: var(--text-primary);
    font-size: 0.85rem;
    font-weight: 500;
    margin-left: 36px;
    transition: opacity 0.3s ease;
  }

  .mode-toggle.dark .toggle-text {
    margin-left: 12px;
  }

  [data-color-mode="dark"] .setting-item {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1),
                0 12px 16px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    .settings {
      padding: 1rem;
    }

    .settings-title {
      font-size: 2rem;
    }

    .settings-grid {
      grid-template-columns: 1fr;
    }

    .settings-section {
      padding: 1rem;
      gap: 1rem;
    }

    .setting-item {
      padding: 1rem;
    }

    .setting-info {
      padding-right: 1rem;
    }

    .setting-info h3 {
      font-size: 1rem;
    }

    .setting-info p {
      font-size: 0.85rem;
    }

    .action-button, .theme-select {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
    }
  }
</style> 
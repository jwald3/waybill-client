<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import { theme, type Theme } from '$lib/stores/theme';
  
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
            <button class="edit-button">Edit</button>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <h3>Notification Preferences</h3>
              <p>Manage your notification settings</p>
            </div>
            <button class="edit-button">Configure</button>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Security Settings</h3>
              <p>Update password and security preferences</p>
            </div>
            <button class="edit-button">Manage</button>
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
            <button class="edit-button">Customize</button>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Data Preferences</h3>
              <p>Manage data display and exports</p>
            </div>
            <button class="edit-button">Configure</button>
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
    color: #1e293b;
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
    gap: 1rem;
  }

  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background: #f8fafc;
    border-radius: 12px;
    transition: all 0.2s ease;
  }

  .setting-item:hover {
    background: #f1f5f9;
  }

  .setting-info h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.25rem;
  }

  .setting-info p {
    color: #64748b;
    font-size: 0.9rem;
  }

  .edit-button {
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    color: var(--theme-color);
    font-weight: 500;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .edit-button:hover {
    background: var(--theme-color);
    border-color: var(--theme-color);
  }

  .theme-select {
    padding: 0.5rem 1rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    color: var(--theme-color);
    font-weight: 500;
    cursor: pointer;
  }

  .theme-select:hover {
    border-color: var(--theme-color);
  }

  :global([data-theme='indigo']) {
    --theme-color: #6366f1;
    --theme-gradient: linear-gradient(90deg, #6366f1, #818cf8);
  }

  :global([data-theme='emerald']) {
    --theme-color: #10b981;
    --theme-gradient: linear-gradient(90deg, #10b981, #34d399);
  }

  :global([data-theme='rose']) {
    --theme-color: #f43f5e;
    --theme-gradient: linear-gradient(90deg, #f43f5e, #fb7185);
  }

  :global([data-theme='amber']) {
    --theme-color: #f59e0b;
    --theme-gradient: linear-gradient(90deg, #f59e0b, #fbbf24);
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
  }
</style> 
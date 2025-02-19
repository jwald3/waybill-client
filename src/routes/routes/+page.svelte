<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  let isNavExpanded = true;
</script>

<Layout {isNavExpanded}>
  <div class="routes">
    <h1 class="routes-title">Route Management</h1>

    <div class="routes-grid">
      <Card title="Active Routes" icon={icons.truck}>
        <div class="route-list">
          {#each Array(3) as _, i}
            <div class="route-item">
              <div class="route-info">
                <h3>Route #{i + 1001}</h3>
                <p class="route-details">Chicago → Detroit → Cleveland</p>
                <div class="route-meta">
                  <span class="driver">John Doe</span>
                  <span class="stops">3 stops</span>
                  <span class="distance">450 miles</span>
                </div>
              </div>
              <div class="route-status">
                <span class="status-badge active">In Progress</span>
              </div>
            </div>
          {/each}
        </div>
      </Card>

      <Card title="Route Planning" icon={icons.routes}>
        <div class="planning-tools">
          <button class="tool-button">Create New Route</button>
          <button class="tool-button">Import Routes</button>
          <button class="tool-button">Route Optimization</button>
        </div>
      </Card>
    </div>
  </div>
</Layout>

<style>
  .routes {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .routes-title {
    font-size: 3rem;
    margin-bottom: 3rem;
    color: var(--text-primary);
    font-weight: 800;
    position: relative;
    letter-spacing: -1px;
  }

  .routes-title::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 100px;
    height: 6px;
    background: var(--theme-gradient);
    border-radius: 3px;
  }

  .routes-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
  }

  .route-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .route-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    background: var(--surface-color);
    border-radius: 12px;
    transition: all 0.2s ease;
    border: 1px solid var(--border-color);
  }

  .route-item:hover {
    background: color-mix(in srgb, var(--theme-color) 3%, var(--surface-color));
    transform: translateX(4px);
    border-color: var(--theme-color);
  }

  .route-info h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .route-details {
    color: var(--text-secondary);
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }

  .route-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: var(--theme-color);
  }

  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .status-badge.active {
    background: linear-gradient(135deg, #059669, #10b981);
    color: white;
  }

  .planning-tools {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .tool-button {
    padding: 1rem;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    color: var(--text-primary);
    font-weight: 500;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .tool-button:hover {
    background: var(--surface-color);
    border-color: var(--theme-color);
    color: var(--theme-color);
    transform: translateY(-2px);
  }

  [data-color-mode="dark"] .route-item {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1),
                0 12px 16px rgba(0, 0, 0, 0.1);
  }

  [data-color-mode="dark"] .tool-button {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    .routes {
      padding: 1rem;
    }

    .routes-title {
      font-size: 2rem;
    }

    .routes-grid {
      grid-template-columns: 1fr;
    }

    .route-item {
      padding: 1.25rem;
    }

    .route-info h3 {
      font-size: 1.1rem;
    }

    .route-details {
      font-size: 0.9rem;
    }

    .tool-button {
      padding: 0.875rem;
    }
  }
</style> 
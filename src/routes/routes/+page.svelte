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
    color: #1e293b;
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
    background: linear-gradient(90deg, #6366f1, #818cf8);
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
    background: #f8fafc;
    border-radius: 12px;
    transition: all 0.2s ease;
  }

  .route-item:hover {
    background: #f1f5f9;
    transform: translateX(4px);
  }

  .route-info h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 0.5rem;
  }

  .route-details {
    color: #64748b;
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }

  .route-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: #6366f1;
  }

  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .status-badge.active {
    background: #dcfce7;
    color: #059669;
  }

  .planning-tools {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .tool-button {
    padding: 1rem;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    color: #1e293b;
    font-weight: 500;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .tool-button:hover {
    background: #f8fafc;
    border-color: #6366f1;
    color: #6366f1;
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
  }
</style> 
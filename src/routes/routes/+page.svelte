<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  
  let isNavExpanded = true;
  
  const routes = [
    {
      id: '1001',
      driver: 'John Doe',
      route: 'Chicago → Detroit → Cleveland',
      status: 'In Progress',
      stops: 3,
      distance: '450 miles'
    },
    {
      id: '1002',
      driver: 'Mike Smith',
      route: 'New York → Boston → Portland',
      status: 'Starting Soon',
      stops: 3,
      distance: '420 miles'
    },
    {
      id: '1003',
      driver: 'Sarah Johnson',
      route: 'Seattle → Portland → San Francisco',
      status: 'Completed',
      stops: 3,
      distance: '808 miles'
    }
  ];
</script>

<Layout {isNavExpanded}>
  <div class="routes">
    <h1 class="routes-title">Route Management</h1>

    <div class="routes-grid">
      <Card title="Active Routes" icon={icons.truck}>
        <div class="routes-section">
          {#each routes as route}
            <div class="route-item">
              <div class="avatar">
                {route.driver.split(' ').map(n => n[0]).join('')}
              </div>
              <div class="route-info">
                <div class="route-header">
                  <h3>Route #{route.id}</h3>
                  <span class="chip {route.status === 'In Progress' ? 'success' : 
                                   route.status === 'Starting Soon' ? 'warning' : 'info'}">
                    {route.status}
                  </span>
                </div>
                <p class="route-path">{route.route}</p>
                <div class="route-meta">
                  <span class="meta-item">
                    <span class="icon">{@html icons.map}</span>
                    {route.stops} stops
                  </span>
                  <span class="meta-item">
                    <span class="icon">{@html icons.distance}</span>
                    {route.distance}
                  </span>
                  <span class="meta-item">
                    <span class="icon">{@html icons.person}</span>
                    {route.driver}
                  </span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </Card>

      <Card title="Route Planning" icon={icons.settings}>
        <div class="routes-section">
          <div class="planning-item">
            <div class="setting-info">
              <h3>Create New Route</h3>
              <p>Plan and schedule a new delivery route</p>
            </div>
            <button class="action-button">Create New Route</button>
          </div>

          <div class="planning-item">
            <div class="setting-info">
              <h3>Import Routes</h3>
              <p>Import route data from external sources</p>
            </div>
            <button class="action-button">Import Routes</button>
          </div>

          <div class="planning-item">
            <div class="setting-info">
              <h3>Route Optimization</h3>
              <p>Optimize existing routes for efficiency</p>
            </div>
            <button class="action-button">Optimize</button>
          </div>
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
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
  }

  .routes-section {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.5rem;
  }

  .route-item, .planning-item {
    display: flex;
    align-items: flex-start;
    padding: 1.25rem;
    background: var(--bg-secondary);
    border-radius: 12px;
    transition: all 0.2s ease;
    border: 1px solid transparent;
    position: relative;
  }

  .route-item:not(:last-child)::after,
  .planning-item:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: -0.625rem;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--border-color);
    opacity: 0.5;
  }

  .route-item:hover, .planning-item:hover {
    background: color-mix(in srgb, var(--theme-color) 2%, var(--surface-color));
    border-color: color-mix(in srgb, var(--theme-color) 15%, var(--border-color));
    transform: translateX(4px);
  }

  .avatar {
    min-width: 50px;
    height: 50px;
    background: var(--theme-gradient);
    color: white;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1.25rem;
    font-weight: 600;
    font-size: 1.1rem;
    box-shadow: 0 6px 12px color-mix(in srgb, var(--theme-color) 20%, transparent);
    transform: rotate(-3deg);
  }

  .route-info {
    flex: 1;
  }

  .route-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .route-header h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .route-path {
    font-size: 1.1rem;
    color: var(--text-primary);
    margin-bottom: 1rem;
  }

  .route-meta {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .meta-item .icon {
    display: flex;
    align-items: center;
    color: var(--theme-color);
  }

  .chip {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .chip.success {
    background: linear-gradient(135deg, #059669, #10b981);
    color: white;
  }

  .chip.warning {
    background: linear-gradient(135deg, #d97706, #fbbf24);
    color: white;
  }

  .chip.info {
    background: var(--theme-gradient);
    color: white;
  }

  .planning-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

  @media (max-width: 768px) {
    .routes {
      padding: 1rem;
    }

    .routes-title {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    .routes-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .routes-section {
      padding: 1rem;
      gap: 1rem;
    }

    .route-item, .planning-item {
      padding: 1rem;
    }

    .route-meta {
      gap: 1rem;
    }

    .avatar {
      min-width: 40px;
      height: 40px;
      font-size: 1rem;
      margin-right: 1rem;
    }

    .setting-info {
      padding-right: 1rem;
    }

    .action-button {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
  }
</style> 
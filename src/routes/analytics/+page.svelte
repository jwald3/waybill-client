<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import MetricCard from '$lib/components/MetricCard.svelte';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import { icons } from '$lib/icons';
  import PieChart from '$lib/components/PieChart.svelte';
  
  export let data;
    
  let isNavExpanded = true;

  // Key metrics
  const metrics = [
    {
      title: "Fleet Status",
      value: `${data.metrics.fleet.available} / ${data.metrics.fleet.total}`,
      trend: { 
        value: `${data.metrics.fleet.inTransit} trucks in transit`, 
        positive: true 
      },
      icon: icons.truck
    },
    {
      title: "Delivery Performance",
      value: `${data.metrics.delivery.onTimeRate}%`,
      trend: { 
        value: `${data.metrics.delivery.failedDeliveries} failed deliveries`, 
        positive: data.metrics.delivery.failedDeliveries === 0 
      },
      icon: icons.chart
    },
    {
      title: "Fleet Efficiency",
      value: `${data.metrics.efficiency.avgMpg} mpg`,
      trend: { 
        value: `$${data.metrics.efficiency.maintenanceCost} maintenance costs`, 
        positive: false 
      },
      icon: icons.analytics
    }
  ];

  // Performance data from recent trips
  const performanceData = {
    labels: data.recentData.trips.map(() => ''),  // Empty labels for now
    datasets: [{
      label: 'Distance (miles)',
      data: data.recentData.trips.map(t => t.distance),
      color: '#6366f1'
    }, {
      label: 'Fuel Usage (gal)',
      data: data.recentData.trips.map(t => t.fuelUsage),
      color: '#10b981'
    }]
  };

  // Add responsive state management
  let windowWidth: number;
  
  $: isMobile = windowWidth < 768;
  $: isTablet = windowWidth >= 768 && windowWidth < 1200;
  
  // Adjust chart heights based on screen size
  $: chartHeight = isMobile ? 300 : isTablet ? 400 : 500;
  $: pieChartHeight = isMobile ? 250 : 300;

  // Helper function to check if data sections are empty
  const isEmpty = (arr: any[]) => !arr || arr.length === 0;
</script>

<svelte:window bind:innerWidth={windowWidth} />

<svelte:head>
  <title>Fleet Analytics | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    <h1 class="page-title">Fleet Analytics</h1>

    {#if data.error}
      <div class="error-container">
        <div class="error-content">
          <div class="error-icon">
            {@html icons.warning}
          </div>
          <h2>Data Loading Error</h2>
          <p>{data.error.message}</p>
          <button 
            class="button primary"
            on:click={() => window.location.reload()}
          >
            <span class="icon">{@html icons.refresh}</span>
            Retry
          </button>
        </div>
      </div>
    {:else}
      <div class="stats-grid">
        {#each metrics as metric}
          <MetricCard {...metric} />
        {/each}
      </div>

      <div class="dashboard-grid">
        <div class="main-column">
          <Card title="Fleet Overview" icon={icons.truck}>
            <div class="overview-stats">
              <div class="stat-item">
                <span class="label">Total Mileage</span>
                <span class="value">{data.metrics.efficiency.totalMileage} mi</span>
              </div>
              <div class="stat-item">
                <span class="label">Fuel Used</span>
                <span class="value">{data.metrics.efficiency.totalFuelUsage} gal</span>
              </div>
              <div class="stat-item">
                <span class="label">Active Trips</span>
                <span class="value">{data.metrics.delivery.activeTrips}</span>
              </div>
            </div>
            <div class="chart-row" class:has-data={!isEmpty(data.charts.fleetStatus)}>
              <div class="chart-container">
                {#if !isEmpty(data.charts.fleetStatus)}
                  <PieChart 
                    data={data.charts.fleetStatus} 
                    centerValue={`${Math.round((data.metrics.fleet.available / data.metrics.fleet.total) * 100)}%`}
                    centerLabel="Available"
                  />
                  <div class="chart-legend">
                    {#each data.charts.fleetStatus as status}
                      <div class="legend-item">
                        <span class="legend-color" style="background-color: {status.color}"></span>
                        <span class="legend-label">{status.label}</span>
                        <span class="legend-value">{status.value}</span>
                      </div>
                    {/each}
                  </div>
                {:else}
                  <div class="empty-state">
                    <div class="icon">
                      {@html icons.truck}
                    </div>
                    <p>No fleet status data available</p>
                  </div>
                {/if}
              </div>
            </div>
          </Card>

          <Card title="Recent Trips" icon={icons.routes}>
            <div class="trips-list">
              {#if !isEmpty(data.recentData.trips)}
                {#each data.recentData.trips as trip}
                  <a href="/trips/{trip.id}" class="trip-item">
                    <div class="trip-header">
                      <div class="trip-id">
                        <StatusBadge status={trip.status} type="trip" />
                        <span class="trip-number">{trip.tripNumber}</span>
                      </div>
                      <div class="trip-stats">
                        <span>{trip.distance} mi</span>
                        <span class="separator">•</span>
                        <span>{trip.fuelUsage} gal</span>
                        <span class="separator">•</span>
                        <span>ETA: {new Date(trip.scheduledArrival).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </a>
                {/each}
              {:else}
                <div class="empty-state">
                  <div class="icon">
                    {@html icons.routes}
                  </div>
                  <p>No recent trips to display</p>
                </div>
              {/if}
            </div>
          </Card>
        </div>

        <div class="side-column">
          <Card title="Maintenance Overview" icon={icons.maintenance}>
            <div class="chart-container-small">
              {#if !isEmpty(data.charts.maintenanceTypes)}
                {@const total = data.charts.maintenanceTypes.reduce((sum, type) => sum + type.value, 0)}
                {@const routineCount = data.charts.maintenanceTypes.find(t => t.label === 'Routine')?.value || 0}
                <PieChart 
                  data={data.charts.maintenanceTypes}
                  centerValue={`${total > 0 ? Math.round((routineCount / total) * 100) : 0}%`}
                  centerLabel="Routine"
                />
              {:else}
                <div class="empty-state">
                  <div class="icon">
                    {@html icons.maintenance}
                  </div>
                  <p>No maintenance data available</p>
                </div>
              {/if}
            </div>
            <!-- Only show maintenance list if we have data -->
            {#if !isEmpty(data.recentData.maintenance)}
              <div class="maintenance-list">
                {#each data.recentData.maintenance as log}
                  <a href="/maintenance/{log.id}" class="maintenance-item">
                    <div class="item-row">
                      <StatusBadge status={log.type} type="maintenance" />
                      <span class="cost">${log.cost}</span>
                    </div>
                    <div class="item-row secondary">
                      <span>{new Date(log.date).toLocaleDateString()}</span>
                    </div>
                  </a>
                {/each}
              </div>
            {/if}
          </Card>

          <Card title="Recent Incidents" icon={icons.incidents}>
            <div class="incidents-list">
              {#if !isEmpty(data.recentData.incidents)}
                {#each data.recentData.incidents as incident}
                  <a href="/incidents/{incident.id}" class="incident-item">
                    <div class="item-row">
                      <StatusBadge status={incident.type} type="incident" />
                      <span class="cost">${incident.damageEstimate}</span>
                    </div>
                    <p class="incident-desc">{incident.description}</p>
                    <div class="item-row secondary">
                      <span>{new Date(incident.date).toLocaleDateString()}</span>
                    </div>
                  </a>
                {/each}
              {:else}
                <div class="empty-state">
                  <div class="icon">
                    {@html icons.incidents}
                  </div>
                  <p>No recent incidents reported</p>
                </div>
              {/if}
            </div>
          </Card>
        </div>
      </div>
    {/if}
  </div>
</Layout>

<style>
  .dashboard-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--spacing-md);
  }

  .main-column, .side-column {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .overview-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }

  .chart-row {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chart-row.has-data {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--spacing-md);
    align-items: center;
  }

  .chart-container {
    height: 250px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .chart-container .empty-state {
    position: absolute;
    inset: 0;
    margin: auto;
    height: auto;
    min-height: unset;
    max-width: 300px;
  }

  .chart-container-small {
    height: 200px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chart-container-small .empty-state {
    position: absolute;
    inset: 0;
    margin: auto;
    height: auto;
    min-height: unset;
  }

  .chart-legend {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm);
    background: var(--bg-secondary);
    border-radius: var(--radius-sm);
    min-width: 150px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-xs);
  }

  .legend-color {
    width: 8px;
    height: 8px;
    border-radius: 2px;
  }

  .legend-value {
    margin-left: auto;
    font-weight: 500;
  }

  .trips-list, .maintenance-list, .incidents-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .trip-item, .maintenance-item, .incident-item {
    padding: var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--bg-secondary);
    text-decoration: none;
    color: inherit;
    transition: all 0.2s;
  }

  .trip-item:hover, .maintenance-item:hover, .incident-item:hover {
    border-color: var(--theme-color);
    background: color-mix(in srgb, var(--theme-color) 2%, var(--bg-secondary));
    transform: translateY(-1px);
  }

  .trip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .trip-id {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .trip-number {
    font-family: monospace;
    color: var(--text-secondary);
  }

  .trip-stats {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }

  .separator {
    color: var(--border-color);
  }

  .item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .item-row.secondary {
    margin-top: var(--spacing-xs);
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  .incident-desc {
    margin: var(--spacing-xs) 0;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
  }

  .cost {
    font-weight: 600;
    color: var(--theme-color);
  }

  @media (max-width: 1200px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
      gap: var(--spacing-md);
    }

    .chart-row.has-data {
      grid-template-columns: 1fr;
      gap: var(--spacing-md);
    }

    .chart-container {
      height: 300px;
    }

    .chart-legend {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: var(--spacing-xs);
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    .overview-stats {
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-sm);
    }

    .chart-container,
    .chart-container-small {
      height: 250px;
    }

    .trip-header {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-xs);
    }

    .trip-stats {
      width: 100%;
      justify-content: space-between;
    }
  }

  @media (max-width: 480px) {
    .overview-stats {
      grid-template-columns: 1fr;
    }

    .chart-container,
    .chart-container-small {
      height: 200px;
    }

    .trip-item,
    .maintenance-item,
    .incident-item {
      padding: var(--spacing-sm);
    }

    .chart-legend {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-lg);
    color: var(--text-secondary);
    text-align: center;
    background: var(--bg-secondary);
    border-radius: var(--radius-sm);
    width: 100%;
    height: 100%;
  }

  .empty-state .icon {
    width: 2.5rem;
    height: 2.5rem;
    margin-bottom: var(--spacing-md);
    opacity: 0.5;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .empty-state .icon :global(svg) {
    width: 100%;
    height: 100%;
  }

  .empty-state p {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    white-space: nowrap;
  }

  .error-container {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-color);
    padding: var(--spacing-2xl);
    margin: 0 auto;
    max-width: 800px;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .error-content {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-lg);
    text-align: center;
  }

  .error-icon {
    width: 48px;
    height: 48px;
    color: var(--theme-color);
  }

  .error-content h2 {
    font-size: var(--font-size-xl);
    color: var(--text-primary);
    margin: 0;
  }

  .error-content p {
    color: var(--text-secondary);
    margin: 0;
  }

  .button {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-lg);
    background: var(--theme-color);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--theme-color) 20%, transparent);
  }

  .button .icon {
    width: 20px;
    height: 20px;
  }
</style> 
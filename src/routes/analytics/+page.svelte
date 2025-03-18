<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import MetricCard from '$lib/components/MetricCard.svelte';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import { icons } from '$lib/icons';
  import PieChart from '$lib/components/PieChart.svelte';
  
  export let data;
  
  console.log('Trips data:', data.recentData.trips);
  
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
</script>

<svelte:window bind:innerWidth={windowWidth} />

<svelte:head>
  <title>Fleet Analytics | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    <h1 class="page-title">Fleet Analytics</h1>

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
          <div class="chart-row">
            <div class="chart-container">
              <PieChart data={data.charts.fleetStatus} />
            </div>
            <div class="chart-legend">
              {#each data.charts.fleetStatus as status}
                <div class="legend-item">
                  <span class="legend-color" style="background-color: {status.color}"></span>
                  <span class="legend-label">{status.label}</span>
                  <span class="legend-value">{status.value}</span>
                </div>
              {/each}
            </div>
          </div>
        </Card>

        <Card title="Recent Trips" icon={icons.routes}>
          <div class="trips-list">
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
          </div>
        </Card>
      </div>

      <div class="side-column">
        <Card title="Maintenance Overview" icon={icons.maintenance}>
          <div class="chart-container-small">
            <PieChart data={data.charts.maintenanceTypes} />
          </div>
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
        </Card>

        <Card title="Recent Incidents" icon={icons.incidents}>
          <div class="incidents-list">
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
          </div>
        </Card>
      </div>
    </div>
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
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--spacing-md);
    align-items: center;
  }

  .chart-container {
    height: 250px;
  }

  .chart-container-small {
    height: 180px;
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
    }

    .chart-row {
      grid-template-columns: 1fr;
    }

    .chart-legend {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    }
  }

  @media (max-width: 640px) {
    .overview-stats {
      grid-template-columns: 1fr;
    }

    .trip-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style> 
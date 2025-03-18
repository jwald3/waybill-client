<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import MetricCard from '$lib/components/MetricCard.svelte';
  import { icons } from '$lib/icons';
  import PieChart from '$lib/components/PieChart.svelte';
  import LineChart from '$lib/components/LineChart.svelte';
  
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

  // Top drivers from server data
  const topDrivers = data.topDrivers;

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
  <div class="analytics">
    <h1 class="analytics-title">Fleet Analytics</h1>

    <!-- Key Metrics -->
    <div class="stats-grid">
      {#each metrics as metric}
        <MetricCard {...metric} />
      {/each}
    </div>

    <div class="analytics-grid">
      <!-- Fleet Overview -->
      <Card title="Fleet Overview" icon={icons.truck}>
        <div class="fleet-stats">
          <div class="stat-item">
            <span class="stat-label">Total Mileage</span>
            <span class="stat-value">{data.metrics.efficiency.totalMileage} mi</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Fuel Used</span>
            <span class="stat-value">{data.metrics.efficiency.totalFuelUsage} gal</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Active Trips</span>
            <span class="stat-value">{data.metrics.delivery.activeTrips}</span>
          </div>
        </div>
        <div class="chart-container">
          <PieChart data={data.charts.fleetStatus} />
        </div>
      </Card>

      <!-- Maintenance Overview -->
      <Card title="Maintenance Overview" icon={icons.wrench}>
        <div class="maintenance-stats">
          <div class="chart-container">
            <PieChart data={data.charts.maintenanceTypes} />
          </div>
          <div class="maintenance-list">
            {#each data.recentData.maintenance as log}
              <div class="maintenance-item">
                <div class="maintenance-type {log.type.toLowerCase()}">{log.type}</div>
                <div class="maintenance-details">
                  <span class="date">{new Date(log.date).toLocaleDateString()}</span>
                  <span class="cost">${log.cost}</span>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </Card>

      <!-- Recent Incidents -->
      <Card title="Recent Incidents" icon={icons.alert}>
        <div class="incidents-list">
          {#each data.recentData.incidents as incident}
            <div class="incident-item">
              <div class="incident-type {incident.type.toLowerCase()}">{incident.type}</div>
              <p class="incident-desc">{incident.description}</p>
              <div class="incident-details">
                <span class="date">{new Date(incident.date).toLocaleDateString()}</span>
                <span class="damage">${incident.damageEstimate}</span>
              </div>
            </div>
          {/each}
        </div>
      </Card>

      <!-- Active Trips -->
      <Card title="Recent Trips" icon={icons.route}>
        <div class="trips-list">
          {#each data.recentData.trips as trip}
            <div class="trip-item">
              <div class="trip-header">
                <span class="trip-number">{trip.tripNumber}</span>
                <span class="trip-status {trip.status.toLowerCase()}">{trip.status}</span>
              </div>
              <div class="trip-details">
                <span>Distance: {trip.distance} mi</span>
                <span>Fuel: {trip.fuelUsage} gal</span>
                <span>ETA: {new Date(trip.scheduledArrival).toLocaleDateString()}</span>
              </div>
            </div>
          {/each}
        </div>
      </Card>
    </div>
  </div>
</Layout>

<style>
  .analytics {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .analytics-title {
    font-size: 3rem;
    margin-bottom: 3rem;
    color: var(--text-primary);
    font-weight: 800;
    position: relative;
    letter-spacing: -1px;
  }

  .analytics-title::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 100px;
    height: 6px;
    background: var(--theme-gradient);
    border-radius: 3px;
  }

  .analytics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 500px), 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .fleet-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .stat-item {
    background: var(--surface-color);
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }

  .chart-container {
    width: 100%;
    height: 300px;
  }

  .maintenance-stats {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .maintenance-list {
    height: 275px;
    overflow-y: auto;
  }

  .maintenance-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--surface-color);
    border-radius: 8px;
  }

  .maintenance-item:last-child {
    border-bottom: none;
  }

  .maintenance-type {
    font-weight: 600;
    color: var(--text-primary);
  }

  .maintenance-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .date {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .cost {
    font-weight: 600;
    color: var(--text-secondary);
  }

  .incidents-list {
    height: 275px;
    overflow-y: auto;
  }

  .incident-item {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--surface-color);
    border-radius: 8px;
  }

  .incident-item:last-child {
    border-bottom: none;
  }

  .incident-type {
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .incident-desc {
    color: var(--text-secondary);
  }

  .trip-list {
    height: 275px;
    overflow-y: auto;
  }

  .trip-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--surface-color);
    border-radius: 8px;
  }

  .trip-item:last-child {
    border-bottom: none;
  }

  .trip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .trip-number {
    font-weight: 600;
    color: var(--text-primary);
  }

  .trip-status {
    font-weight: 600;
    color: var(--text-primary);
  }

  .trip-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .trips {
    color: var(--text-secondary);
    text-align: center;
  }

  .revenue {
    font-weight: 600;
    color: #10b981;
    text-align: right;
  }

  .table-header .center {
    text-align: center;
  }

  .table-header .right {
    text-align: right;
  }

  .drivers-list {
    height: 275px;
    overflow-y: auto;
  }

  .driver-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--surface-color);
    border-radius: 8px;
  }

  .driver-item:last-child {
    border-bottom: none;
  }

  .driver-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .avatar {
    width: 40px;
    height: 40px;
    background: var(--theme-gradient);
    color: white;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    transform: rotate(-3deg);
  }

  .details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .name {
    font-weight: 600;
    color: var(--text-primary);
  }

  .stats {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .chart-body {
    flex: 1;
    display: flex;
    height: calc(100% - 80px);
  }

  /* Update chart styles */
  :global(.chart-wrapper) {
    background: var(--surface-color);
    border-radius: 12px;
    padding: 1rem;
    border: 1px solid var(--border-color);
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  :global(.chart-wrapper canvas) {
    height: 100% !important;
    width: 100% !important;
  }

  .cost-legend {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.25rem;
    background: var(--bg-secondary);
    border-radius: 12px;
    border: 1px solid var(--border-color);
  }

  .cost-legend-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: var(--surface-color);
    border-radius: 8px;
    border: 1px solid var(--border-color);
    transition: all 0.2s ease;
  }

  .cost-legend-item:hover {
    background: color-mix(in srgb, var(--theme-color) 3%, var(--surface-color));
    transform: translateX(4px);
    border-color: var(--theme-color);
  }

  .cost-legend-color {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .cost-legend-item:hover .cost-legend-color {
    transform: scale(1.2);
  }

  .cost-legend-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
  }

  .cost-legend-label {
    font-weight: 500;
    color: var(--text-primary);
  }

  .cost-legend-value {
    font-weight: 600;
    color: var(--text-secondary);
  }

  @media (max-width: 1200px) {
    .analytics-grid {
      grid-template-columns: 1fr;
    }

    .chart-container {
      height: 500px;
    }

    .chart-body {
      height: calc(100% - 80px);
    }
  }

  @media (max-width: 768px) {
    .analytics {
      padding: 1rem;
    }

    .analytics-title {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    .analytics-grid {
      grid-template-columns: 1fr;
    }

    .chart-container {
      height: 400px;
    }

    .chart-body {
      height: calc(100% - 80px);
    }

    .cost-chart {
      height: 300px;
    }
  }

  /* Update scrollbar styles for dark mode */
  .routes-table::-webkit-scrollbar,
  .drivers-list::-webkit-scrollbar {
    width: 6px;
  }

  .routes-table::-webkit-scrollbar-track,
  .drivers-list::-webkit-scrollbar-track {
    background: var(--surface-color);
    border-radius: 3px;
  }

  .routes-table::-webkit-scrollbar-thumb,
  .drivers-list::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
  }

  .routes-table::-webkit-scrollbar-thumb:hover,
  .drivers-list::-webkit-scrollbar-thumb:hover {
    background: var(--text-secondary);
  }

  /* Update alert icons for dark mode */
  [data-color-mode="dark"] .alert-icon.warning {
    background: color-mix(in srgb, #d97706 15%, var(--surface-color));
    color: #fbbf24;
  }

  [data-color-mode="dark"] .alert-icon.success {
    background: color-mix(in srgb, #059669 15%, var(--surface-color));
    color: #34d399;
  }

  [data-color-mode="dark"] .alert-icon.error {
    background: color-mix(in srgb, #dc2626 15%, var(--surface-color));
    color: #f87171;
  }
</style> 
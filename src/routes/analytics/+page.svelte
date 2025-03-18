<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import MetricCard from '$lib/components/MetricCard.svelte';
  import { icons } from '$lib/icons';
  import PieChart from '$lib/components/PieChart.svelte';
  import LineChart from '$lib/components/LineChart.svelte';
  
  export let data;
  
  let isNavExpanded = true;

  // Real metrics from server data
  const metrics = [
    {
      title: "On-Time Delivery Rate",
      value: `${data.metrics.onTimeRate}%`,
      trend: { value: `${data.metrics.totalTrips} total trips`, positive: true },
      icon: icons.truck
    },
    {
      title: "Average Trip Duration",
      value: `${data.metrics.avgDuration}h`,
      trend: { value: `${data.metrics.incidentCount} incidents reported`, positive: true },
      icon: icons.chart
    },
    {
      title: "Fuel Efficiency",
      value: `${data.metrics.avgMpg} mpg`,
      trend: { value: `${data.metrics.activeDrivers} active drivers`, positive: true },
      icon: icons.analytics
    }
  ];

  // Recent trips from server data
  const recentTrips = data.recentTrips;

  // Fleet status data from server
  const fleetStatusData = data.fleetStatus;

  // Performance data (could be enhanced with more historical data)
  const performanceData = {
    labels: recentTrips.map(() => ''),  // Empty labels for now
    datasets: [{
      label: 'Distance (miles)',
      data: recentTrips.map(t => t.distance),
      color: '#6366f1'
    }, {
      label: 'Fuel Usage (gal)',
      data: recentTrips.map(t => t.fuelUsage),
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
  <title>Analytics & Insights | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="analytics">
    <h1 class="analytics-title">Analytics & Insights</h1>

    <!-- Metrics Grid -->
    <div class="stats-grid">
      {#each metrics as metric}
        <MetricCard {...metric} />
      {/each}
    </div>

    <div class="analytics-content">
      <!-- Performance Chart Card -->
      <Card title="Performance Trends" icon={icons.chart}>
        <div class="chart-container">
          <div class="chart-header">
            <div class="chart-legend">
              {#each performanceData.datasets as dataset}
                <span class="legend-item">
                  <span class="dot" style="background-color: {dataset.color}"></span>
                  {dataset.label}
                </span>
              {/each}
            </div>
            <select class="time-range">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
            </select>
          </div>
          <div class="chart-body">
            <LineChart data={performanceData} />
          </div>
        </div>
      </Card>

      <!-- Cost Analysis Grid -->
      <div class="analysis-grid">
        <Card title="Fleet Status" icon={icons.truck}>
          <div class="cost-analysis">
            <div class="cost-chart">
              <PieChart data={fleetStatusData} />
            </div>
            <div class="cost-legend">
              {#each fleetStatusData as item}
                <div class="cost-legend-item">
                  <div class="cost-legend-color" style="background-color: {item.color}"></div>
                  <div class="cost-legend-details">
                    <span class="cost-legend-label">{item.label}</span>
                    <span class="cost-legend-value">{item.value}</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </Card>

        <!-- Side Cards Grid -->
        <div class="side-cards">
          <Card title="Recent Trips" icon={icons.chart}>
            <div class="routes-table">
              <div class="table-header">
                <span>Trip Number</span>
                <span class="center">Distance</span>
                <span class="right">Status</span>
              </div>
              {#each recentTrips as trip}
                <div class="table-row">
                  <span class="route-name">{trip.tripNumber}</span>
                  <span class="trips">{trip.distance} mi</span>
                  <span class="revenue">{trip.status}</span>
                </div>
              {/each}
            </div>
          </Card>

          <Card title="Driver Performance" icon={icons.people}>
            <div class="drivers-list">
              {#each topDrivers as driver}
                <div class="driver-item">
                  <div class="driver-info">
                    <div class="avatar">{driver.avatar}</div>
                    <div class="details">
                      <span class="name">{driver.name}</span>
                      <span class="stats">
                        {driver.state}
                      </span>
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </Card>
        </div>
      </div>
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

  .analytics-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    min-height: 600px;
  }

  .analysis-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 600px), 1fr));
    gap: 1.5rem;
  }

  .side-cards {
    display: grid;
    gap: 1.5rem;
  }

  .cost-analysis {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: 100%;
  }

  .cost-chart {
    width: 100%;
    height: 300px;
  }

  .chart-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 600px;
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem;
    background: var(--surface-color);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }

  .chart-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .dot.delivery { background: var(--theme-color); }
  .dot.fuel { background: #10b981; }
  .dot.cost { background: #f59e0b; }
  .dot.maintenance { background: #ef4444; }
  .dot.labor { background: #8b5cf6; }
  .dot.other { background: #64748b; }

  .time-range {
    padding: 0.5rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    background: var(--bg-secondary);
  }

  .table-header, .table-row {
    display: grid;
    grid-template-columns: minmax(200px, 2fr) minmax(80px, 1fr) minmax(100px, 1fr);
    gap: 1.5rem;
    padding: 0.875rem 1.25rem;
    align-items: center;
  }

  .table-header {
    position: sticky;
    top: 0;
    background: var(--surface-color);
    border-radius: 8px;
    font-weight: 600;
    color: var(--text-secondary);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border: 1px solid var(--border-color);
  }

  .table-row {
    border-bottom: 1px solid var(--border-color);
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .route-name {
    color: var(--theme-color);
    font-weight: 500;
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
    .analysis-grid {
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

    .analysis-grid {
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
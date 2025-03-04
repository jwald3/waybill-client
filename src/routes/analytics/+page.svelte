<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import MetricCard from '$lib/components/MetricCard.svelte';
  import { icons } from '$lib/icons';
  import PieChart from '$lib/components/PieChart.svelte';
  import LineChart from '$lib/components/LineChart.svelte';
  
  let isNavExpanded = true;

  // Dummy data for metrics
  const metrics = [
    {
      title: "On-Time Delivery Rate",
      value: "94.2%",
      trend: { value: "2.1% from last month", positive: true },
      icon: icons.truck
    },
    {
      title: "Average Trip Duration",
      value: "4h 12m",
      trend: { value: "18min longer than target", positive: false },
      icon: icons.chart
    },
    {
      title: "Fuel Efficiency",
      value: "7.2 mpg",
      trend: { value: "0.4 mpg improvement", positive: true },
      icon: icons.analytics
    }
  ];

  // Dummy data for top routes
  const topRoutes = [
    { from: "Chicago", to: "Detroit", trips: 145, revenue: "$58,400" },
    { from: "New York", to: "Boston", trips: 132, revenue: "$42,900" },
    { from: "Los Angeles", to: "San Francisco", trips: 128, revenue: "$51,200" }
  ];

  const costData = [
    { label: 'Fuel', value: 42, color: '#10b981' },
    { label: 'Maintenance', value: 28, color: '#ef4444' },
    { label: 'Labor', value: 22, color: '#8b5cf6' },
    { label: 'Other', value: 8, color: '#64748b' }
  ];

  const performanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Delivery Times',
        data: [24, 28, 26, 32, 29, 24, 25],
        color: '#6366f1'
      },
      {
        label: 'Fuel Consumption',
        data: [18, 22, 19, 24, 21, 18, 19],
        color: '#10b981'
      },
      {
        label: 'Operating Costs',
        data: [12, 15, 13, 17, 14, 12, 13],
        color: '#f59e0b'
      }
    ]
  };

  // Add driver performance data
  const topDrivers = [
    { 
      name: "John Smith",
      avatar: "JS",
      deliveries: 42,
      rating: 4.9,
      onTime: "98%"
    },
    {
      name: "Maria Garcia",
      avatar: "MG",
      deliveries: 38,
      rating: 4.8,
      onTime: "96%"
    },
    {
      name: "David Chen",
      avatar: "DC",
      deliveries: 35,
      rating: 4.8,
      onTime: "95%"
    }
  ];

  const recentAlerts = [
    {
      type: 'warning',
      message: 'Fuel consumption above average on Route CHI-DET',
      time: '2h ago'
    },
    {
      type: 'success',
      message: 'All drivers completed safety training',
      time: '4h ago'
    },
    {
      type: 'error',
      message: 'Maintenance due for Truck #1234',
      time: '6h ago'
    }
  ];

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
        <Card title="Cost Breakdown" icon={icons.analytics}>
          <div class="cost-analysis">
            <div class="cost-chart">
              <PieChart data={costData} />
            </div>
            <div class="cost-legend">
              {#each costData as item}
                <div class="cost-legend-item">
                  <div class="cost-legend-color" style="background-color: {item.color}"></div>
                  <div class="cost-legend-details">
                    <span class="cost-legend-label">{item.label}</span>
                    <span class="cost-legend-value">{item.value}%</span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </Card>

        <!-- Side Cards Grid -->
        <div class="side-cards">
          <Card title="Top Performing Routes" icon={icons.truck}>
            <div class="routes-table">
              <div class="table-header">
                <span>Route</span>
                <span class="center">Trips</span>
                <span class="right">Revenue</span>
              </div>
              {#each topRoutes as route}
                <div class="table-row">
                  <span class="route-name">{route.from} → {route.to}</span>
                  <span class="trips">{route.trips}</span>
                  <span class="revenue">{route.revenue}</span>
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
                        {driver.deliveries} deliveries • {driver.onTime} on-time
                      </span>
                    </div>
                  </div>
                  <div class="rating">
                    <span class="rating-value">{driver.rating}</span>
                    <span class="rating-label">rating</span>
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
    height: 100%;
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

  .rating {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.125rem;
  }

  .rating-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #10b981;
  }

  .rating-label {
    font-size: 0.75rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .alerts-list {
    height: 275px;
    overflow-y: auto;
  }

  .alert-item {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--border-color);
    background: var(--surface-color);
    border-radius: 8px;
  }

  .alert-item:last-child {
    border-bottom: none;
  }

  .alert-content {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .alert-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .alert-icon.warning {
    background: #fef3c7;
    color: #d97706;
  }

  .alert-icon.success {
    background: #dcfce7;
    color: #059669;
  }

  .alert-icon.error {
    background: #fee2e2;
    color: #dc2626;
  }

  .alert-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }

  .alert-message {
    color: var(--text-primary);
    font-weight: 500;
    line-height: 1.4;
  }

  .alert-time {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  /* For the LineChart component wrapper */
  :global(.chart-container > :global(.chart-wrapper)) {
    flex: 1;
    min-height: 0;
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

    .chart-header {
      flex-direction: column;
      align-items: stretch;
    }

    .time-range {
      width: 100%;
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

    .chart-header {
      flex-direction: column;
      align-items: stretch;
    }

    .time-range {
      width: 100%;
    }

    .card-content {
      max-height: 500px;
      overflow-y: auto;
    }

    .chart-body {
      min-height: 300px;
    }

    .cost-chart {
      height: 250px;
    }
  }

  /* Update chart styles */
  :global(.chart-wrapper) {
    background: var(--surface-color);
    border-radius: 12px;
    padding: 1rem;
    border: 1px solid var(--border-color);
    height: 100%;
    width: 100%;
  }

  [data-color-mode="dark"] :global(.chart-wrapper) {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  /* Update scrollbar styles for dark mode */
  .routes-table::-webkit-scrollbar,
  .drivers-list::-webkit-scrollbar,
  .alerts-list::-webkit-scrollbar {
    width: 6px;
  }

  .routes-table::-webkit-scrollbar-track,
  .drivers-list::-webkit-scrollbar-track,
  .alerts-list::-webkit-scrollbar-track {
    background: var(--surface-color);
    border-radius: 3px;
  }

  .routes-table::-webkit-scrollbar-thumb,
  .drivers-list::-webkit-scrollbar-thumb,
  .alerts-list::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
  }

  .routes-table::-webkit-scrollbar-thumb:hover,
  .drivers-list::-webkit-scrollbar-thumb:hover,
  .alerts-list::-webkit-scrollbar-thumb:hover {
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
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
    },
    {
      title: "Driver Satisfaction",
      value: "4.8/5.0",
      trend: { value: "0.2 from last quarter", positive: true },
      icon: icons.people
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
</script>

<Layout {isNavExpanded}>
  <div class="analytics">
    <h1 class="analytics-title">Analytics & Insights</h1>

    <!-- Metrics Grid -->
    <div class="stats-grid">
      {#each metrics as metric}
        <Card title={metric.title} icon={metric.icon}>
          <div class="stat-content">
            <p class="stat-number">{metric.value}</p>
            <p class="stat-label">
              {metric.trend.value}
              <span class="trend {metric.trend.positive ? 'positive' : 'negative'}">
                {metric.trend.positive ? '↑' : '↓'}
              </span>
            </p>
          </div>
        </Card>
      {/each}
    </div>

    <div class="analytics-content">
      <!-- Main Content Grid -->
      <div class="main-content">
        <!-- Left Column -->
        <div class="main-column">
          <Card title="Performance Trends" icon={icons.chart}>
            <div class="chart-container">
              <div class="chart-header">
                <div class="chart-legend">
                  <span class="legend-item">
                    <span class="dot delivery"></span>
                    Delivery Times
                  </span>
                  <span class="legend-item">
                    <span class="dot fuel"></span>
                    Fuel Consumption
                  </span>
                  <span class="legend-item">
                    <span class="dot cost"></span>
                    Operating Costs
                  </span>
                </div>
                <select class="time-range">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last Quarter</option>
                </select>
              </div>
              <LineChart data={performanceData} />
            </div>
          </Card>

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
        </div>

        <!-- Right Column -->
        <div class="side-column">
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

          <Card title="Recent Alerts" icon={icons.alert}>
            <div class="alerts-list">
              {#each recentAlerts as alert}
                <div class="alert-item">
                  <div class="alert-content">
                    <div class="alert-icon {alert.type}">
                      {#if alert.type === 'warning'}
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                          <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z"/>
                        </svg>
                      {:else if alert.type === 'success'}
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                        </svg>
                      {:else}
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                      {/if}
                    </div>
                    <div class="alert-details">
                      <span class="alert-message">{alert.message}</span>
                      <span class="alert-time">{alert.time}</span>
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

  .stat-content {
    text-align: center;
    padding: 1.5rem;
  }

  .stat-number {
    font-size: 3rem;
    font-weight: 800;
    color: var(--theme-color);
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: var(--text-secondary);
    font-size: 0.95rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .trend {
    font-weight: 600;
  }

  .trend.positive {
    color: #10b981;
  }

  .trend.negative {
    color: #ef4444;
  }

  .analytics-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .main-content {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: 1.5rem;
    align-items: start;
  }

  .main-column {
    display: grid;
    grid-template-rows: 1.5fr 1fr;  /* Increased ratio for performance trends */
    gap: 1.5rem;
    height: 100%;
    min-height: 800px;  /* Ensure minimum height for better visualization */
  }

  .side-column {
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 1.5rem;
    height: 100%;
  }

  .chart-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0; /* Important for flex child scrolling */
    padding: 1.5rem;
  }

  .cost-analysis {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 2rem;
    padding: 1.5rem;
    height: 100%;
    align-items: center;
    background: var(--surface-color);
    border-radius: 12px;
    border: 1px solid var(--border-color);
  }

  .routes-table,
  .drivers-list,
  .alerts-list {
    overflow-y: auto;
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: var(--surface-color);
    border-radius: 8px;
    margin-bottom: 1rem;
    flex-shrink: 0;
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

  .cost-chart {
    width: 100%;
    height: 100%;
    min-height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
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

  @media (max-width: 1400px) {
    .main-content {
      grid-template-columns: 1fr;
    }

    .main-column {
      grid-template-rows: minmax(500px, auto) auto;
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

    .main-content {
      grid-template-columns: 1fr;
    }

    .main-column {
      grid-template-rows: minmax(500px, auto) auto;
    }

    .chart-container {
      min-height: 400px;
    }

    .cost-analysis {
      background: var(--surface-color);
      padding: 1rem;
    }

    .cost-legend {
      box-shadow: none;
      padding: 1rem;
      background: var(--surface-color);
    }

    .cost-chart {
      min-height: 200px;
    }

    .cost-legend {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 0.75rem;
      padding: 0.75rem;
    }
  }

  /* Update chart styles */
  :global(.chart-wrapper) {
    background: var(--surface-color);
    border-radius: 12px;
    padding: 1rem;
    border: 1px solid var(--border-color);
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
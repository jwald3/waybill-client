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
    <header class="analytics-header">
      <h1 class="analytics-title">Analytics & Insights</h1>
    </header>

    <div class="analytics-content">
      <!-- Metrics Grid -->
      <div class="metrics-grid">
        {#each metrics as metric}
          <MetricCard {...metric} />
        {/each}
      </div>

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
                <div class="legend-item">
                  <span class="dot fuel"></span>
                  <span class="legend-text">
                    <span class="legend-label">Fuel</span>
                    <span class="legend-value">42%</span>
                  </span>
                </div>
                <div class="legend-item">
                  <span class="dot maintenance"></span>
                  <span class="legend-text">
                    <span class="legend-label">Maintenance</span>
                    <span class="legend-value">28%</span>
                  </span>
                </div>
                <div class="legend-item">
                  <span class="dot labor"></span>
                  <span class="legend-text">
                    <span class="legend-label">Labor</span>
                    <span class="legend-value">22%</span>
                  </span>
                </div>
                <div class="legend-item">
                  <span class="dot other"></span>
                  <span class="legend-text">
                    <span class="legend-label">Other</span>
                    <span class="legend-value">8%</span>
                  </span>
                </div>
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
    max-width: 1800px;
    margin: 0 auto;
    padding: 2rem;
  }

  .analytics-header {
    margin-bottom: 2rem;
  }

  .analytics-title {
    font-size: 2.25rem;
    color: #1e293b;
    font-weight: 800;
    letter-spacing: -1px;
  }

  .analytics-content {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .main-content {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: 1.5rem;
    align-items: start;
  }

  .main-column {
    display: grid;
    grid-template-rows: 1.2fr 1fr;  /* Performance trends slightly larger than cost breakdown */
    gap: 1.5rem;
    height: 100%;
  }

  .side-column {
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 1.5rem;
    height: 100%;
  }

  .chart-container {
    height: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }

  .cost-analysis {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 2rem;
    padding: 1rem;
    height: 100%;
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
    padding: 0.75rem;
    margin-bottom: 1rem;
    background: #f8fafc;
    border-radius: 8px;
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
    color: #475569;
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
    border: 1px solid #e2e8f0;
    color: #64748b;
    background: white;
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
    background: #f8fafc;
    border-radius: 8px;
    font-weight: 600;
    color: #475569;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .table-row {
    border-bottom: 1px solid #e2e8f0;
  }

  .table-row:last-child {
    border-bottom: none;
  }

  .route-name {
    font-weight: 500;
    color: var(--theme-color);
  }

  .trips {
    color: #64748b;
    font-weight: 500;
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
    border-bottom: 1px solid #e2e8f0;
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
    color: #1e293b;
  }

  .stats {
    font-size: 0.875rem;
    color: #64748b;
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
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .alerts-list {
    height: 275px;
    overflow-y: auto;
  }

  .alert-item {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #e2e8f0;
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
    color: #1e293b;
    font-weight: 500;
    line-height: 1.4;
  }

  .alert-time {
    color: #64748b;
    font-size: 0.875rem;
  }

  @media (max-width: 1400px) {
    .main-content {
      grid-template-columns: 1fr;
    }

    .main-column {
      grid-template-rows: auto;
    }

    .chart-container {
      height: 400px;
    }

    .cost-analysis {
      height: 350px;
    }

    .side-column {
      grid-template-rows: auto;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    }

    .routes-table,
    .drivers-list,
    .alerts-list {
      max-height: 300px;
    }
  }

  @media (max-width: 768px) {
    .analytics {
      padding: 1rem;
    }

    .metrics-grid {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }

    .chart-container {
      height: 300px;
    }

    .cost-analysis {
      grid-template-columns: 1fr;
      height: auto;
    }

    .cost-chart {
      height: 300px;
    }
  }
</style> 
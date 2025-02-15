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
</script>

<Layout {isNavExpanded}>
  <div class="analytics">
    <header class="analytics-header">
      <h1 class="analytics-title">Analytics & Insights</h1>
    </header>

    <div class="analytics-content">
      <!-- Metrics Section -->
      <section class="metrics-section">
        <div class="metrics-grid">
          {#each metrics as metric}
            <MetricCard {...metric} />
          {/each}
        </div>
      </section>

      <!-- Charts Section -->
      <section class="charts-section">
        <div class="analytics-grid">
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
        </div>
      </section>

      <!-- Cost Analysis Section -->
      <section class="cost-section">
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
      </section>
    </div>
  </div>
</Layout>

<style>
  .analytics {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
  }

  .analytics-header {
    padding-bottom: 1rem;
  }

  .analytics-title {
    font-size: 2.5rem;
    color: #1e293b;
    font-weight: 800;
    position: relative;
    letter-spacing: -1px;
  }

  .analytics-title::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 80px;
    height: 4px;
    background: var(--theme-gradient);
    border-radius: 2px;
  }

  .analytics-content {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
  }

  .metrics-section {
    margin-top: 1rem;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .charts-section {
    margin-top: 1rem;
  }

  .analytics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: 2rem;
  }

  .cost-section {
    margin-top: 1rem;
  }

  .chart-placeholder {
    background: #f8fafc;
    border: 2px dashed color-mix(in srgb, var(--theme-color) 20%, transparent);
    border-radius: 12px;
    padding: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    font-style: italic;
  }

  .chart-container {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .chart-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .legend-item {
    white-space: nowrap;
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

  .routes-table {
    width: 100%;
    overflow-x: auto;
  }

  .table-header, .table-row {
    display: grid;
    grid-template-columns: minmax(200px, 2fr) minmax(80px, 1fr) minmax(100px, 1fr);
    gap: 1.5rem;
    min-width: 400px;
    padding: 0.75rem 1.25rem;
    align-items: center;
  }

  .table-header {
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

  .cost-analysis {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 3rem;
    align-items: start;
    padding: 1rem;
  }

  .cost-chart {
    min-height: 300px;
  }

  .cost-legend {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .legend-text {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    font-size: 0.95rem;
    color: #1e293b;
  }

  .legend-label {
    font-weight: 500;
  }

  .legend-value {
    color: #64748b;
  }

  .table-header .center {
    text-align: center;
  }

  .table-header .right {
    text-align: right;
  }

  @media (max-width: 768px) {
    .analytics {
      padding: 1.5rem;
      gap: 1.5rem;
    }

    .analytics-content {
      gap: 2rem;
    }

    .analytics-title {
      font-size: 2rem;
    }

    .metrics-grid {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }

    .analytics-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .cost-analysis {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .cost-legend {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }
  }

  @media (max-width: 480px) {
    .analytics {
      padding: 1rem;
      gap: 1.25rem;
    }

    .analytics-content {
      gap: 1.5rem;
    }

    .analytics-title {
      font-size: 1.75rem;
    }

    .metrics-grid {
      grid-template-columns: 1fr;
    }

    .cost-legend {
      grid-template-columns: 1fr;
    }
  }
</style> 
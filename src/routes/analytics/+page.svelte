<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import MetricCard from '$lib/components/MetricCard.svelte';
  import { icons } from '$lib/icons';
  
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
              <div class="chart-placeholder">
                <p>Line chart showing key performance metrics over time</p>
              </div>
            </div>
          </Card>

          <Card title="Top Performing Routes" icon={icons.truck}>
            <div class="routes-table">
              <div class="table-header">
                <span class="header-route">Route</span>
                <span class="header-trips">Trips</span>
                <span class="header-revenue">Revenue</span>
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
              <div class="chart-placeholder">
                <p>Pie chart showing cost distribution</p>
              </div>
            </div>
            <div class="cost-legend">
              <div class="legend-item">
                <span class="dot fuel"></span>
                <span>Fuel (42%)</span>
              </div>
              <div class="legend-item">
                <span class="dot maintenance"></span>
                <span>Maintenance (28%)</span>
              </div>
              <div class="legend-item">
                <span class="dot labor"></span>
                <span>Labor (22%)</span>
              </div>
              <div class="legend-item">
                <span class="dot other"></span>
                <span>Other (8%)</span>
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
    gap: 2rem;
    align-items: center;
  }

  .cost-legend {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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
  }
</style> 
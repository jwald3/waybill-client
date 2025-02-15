<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  let isNavExpanded = true;
</script>

<Layout {isNavExpanded}>
  <div class="analytics">
    <h1 class="analytics-title">Analytics & Insights</h1>

    <div class="metrics-grid">
      <Card className="metric">
        <h3>On-Time Delivery Rate</h3>
        <p class="metric-value">94.2%</p>
        <p class="metric-trend positive">↑ 2.1% from last month</p>
      </Card>

      <Card className="metric">
        <h3>Average Trip Duration</h3>
        <p class="metric-value">4h 12m</p>
        <p class="metric-trend negative">↓ 18min longer than target</p>
      </Card>

      <Card className="metric">
        <h3>Fuel Efficiency</h3>
        <p class="metric-value">7.2 mpg</p>
        <p class="metric-trend positive">↑ 0.4 mpg improvement</p>
      </Card>

      <Card className="metric">
        <h3>Driver Satisfaction</h3>
        <p class="metric-value">4.8/5.0</p>
        <p class="metric-trend positive">↑ 0.2 from last quarter</p>
      </Card>
    </div>

    <Card title="Performance Trends" icon={icons.chart} className="section">
      <div class="chart-placeholder">
        <p>Line chart showing delivery times, fuel consumption, and costs over time</p>
      </div>
    </Card>

    <div class="analytics-grid">
      <Card title="Popular Routes" icon={icons.truck} className="section">
        <div class="chart-placeholder">
          <p>Map visualization of most frequent delivery routes</p>
        </div>
      </Card>

      <Card title="Cost Analysis" icon={icons.analytics} className="section">
        <div class="chart-placeholder">
          <p>Pie chart breaking down operational costs</p>
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
    width: 100px;
    height: 6px;
    background: var(--theme-gradient);
    border-radius: 3px;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .analytics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
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

  .metric-value {
    color: var(--theme-color);
  }

  .metric-trend.positive {
    color: #10b981;
  }

  .metric-trend.negative {
    color: #ef4444;
  }

  @media (max-width: 768px) {
    .analytics {
      padding: 1rem;
    }

    .analytics-title {
      font-size: 2rem;
    }

    .metrics-grid {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    }

    .analytics-grid {
      grid-template-columns: 1fr;
    }

    .metric-value {
      font-size: 2rem;
    }
  }
</style> 
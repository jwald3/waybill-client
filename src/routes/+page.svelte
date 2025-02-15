<script lang="ts">
  // Remove the Card import since we're not using it
</script>

<div class="dashboard">
  <h1 class="dashboard-title">Logistics Dashboard</h1>

  <!-- Summary Cards -->
  <div class="summary-cards">
    <div class="card">
      <div class="card-header">
        <span class="icon">🚚</span>
        <h2>Active Trips</h2>
      </div>
      <p class="number">24</p>
      <p class="subtitle">8 arriving today</p>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="icon">👤</span>
        <h2>Drivers on Duty</h2>
      </div>
      <p class="number">18</p>
      <p class="subtitle">85% of fleet active</p>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="icon">📈</span>
        <h2>Deliveries Today</h2>
      </div>
      <p class="number">42</p>
      <p class="subtitle">93% on time</p>
    </div>
  </div>

  <!-- Active Trips -->
  <div class="card section">
    <h2>Active Trips</h2>
    <div class="trips">
      {#each Array(3) as _, i}
        <div class="trip-item">
          <div class="avatar">JD</div>
          <div class="trip-info">
            <p class="route">Chicago, IL → Detroit, MI</p>
            <p class="details">John Doe • Truck #1234</p>
          </div>
          <div class="status">
            <span class="chip success">On Schedule</span>
            <p class="eta">ETA: 2:30 PM</p>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Recent Deliveries -->
  <div class="card section">
    <h2>Recent Deliveries</h2>
    <div class="deliveries">
      {#each Array(3) as _, i}
        <div class="delivery-item">
          <div class="avatar">MS</div>
          <div class="delivery-info">
            <p class="route">New York, NY → Boston, MA</p>
            <p class="details">Mike Smith • Completed at 10:45 AM</p>
          </div>
          <span class="chip info">Delivered</span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  :global(body) {
    background: #f0f4f8;
  }

  .dashboard {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .dashboard-title {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: #1a365d;
    font-weight: 700;
    position: relative;
  }

  .dashboard-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 4px;
    background: #3182ce;
    border-radius: 2px;
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .card {
    background: white;
    border-radius: 12px;
    padding: 1.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
    border: 1px solid rgba(226, 232, 240, 0.8);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .card-header h2 {
    color: #2d3748;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .icon {
    font-size: 1.5rem;
    background: #ebf8ff;
    padding: 0.5rem;
    border-radius: 8px;
  }

  .number {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0.75rem 0;
    background: linear-gradient(135deg, #2c5282, #3182ce);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
  }

  .subtitle {
    color: #718096;
    font-size: 0.9rem;
  }

  .section {
    margin-bottom: 2rem;
  }

  .section h2 {
    color: #2d3748;
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }

  .trip-item, .delivery-item {
    display: flex;
    align-items: center;
    padding: 1.25rem;
    border-bottom: 1px solid #e2e8f0;
    transition: background-color 0.2s ease;
  }

  .trip-item:hover, .delivery-item:hover {
    background-color: #f7fafc;
  }

  .avatar {
    width: 45px;
    height: 45px;
    background: linear-gradient(135deg, #3182ce, #2c5282);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .trip-info, .delivery-info {
    flex: 1;
  }

  .route {
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: #2d3748;
  }

  .details {
    color: #718096;
    font-size: 0.9rem;
  }

  .chip {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    letter-spacing: 0.3px;
  }

  .chip.success {
    background: #c6f6d5;
    color: #22543d;
  }

  .chip.info {
    background: #bee3f8;
    color: #2c5282;
  }

  .eta {
    color: #718096;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    text-align: right;
  }

  /* Custom scrollbar for webkit browsers */
  .trips, .deliveries {
    max-height: 400px;
    overflow-y: auto;
  }

  .trips::-webkit-scrollbar, .deliveries::-webkit-scrollbar {
    width: 8px;
  }

  .trips::-webkit-scrollbar-track, .deliveries::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  .trips::-webkit-scrollbar-thumb, .deliveries::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 4px;
  }

  .trips::-webkit-scrollbar-thumb:hover, .deliveries::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
  }

  @media (max-width: 768px) {
    .dashboard {
      padding: 1rem;
    }

    .number {
      font-size: 2rem;
    }

    .card-header h2 {
      font-size: 1rem;
    }
  }
</style>

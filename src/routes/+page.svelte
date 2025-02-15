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
    background: #f0f4ff;
    background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
    color: #1e293b;
  }

  .dashboard {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
  }

  .dashboard-title {
    font-size: 3rem;
    margin-bottom: 3rem;
    color: #1e293b;
    font-weight: 800;
    position: relative;
    letter-spacing: -1px;
  }

  .dashboard-title::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 100px;
    height: 6px;
    background: linear-gradient(90deg, #6366f1, #818cf8);
    border-radius: 3px;
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .card {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02),
                0 12px 16px rgba(0, 0, 0, 0.05),
                0 0 0 1px rgba(99, 102, 241, 0.08);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, #6366f1, #818cf8);
  }

  .card:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.06),
                0 20px 30px rgba(0, 0, 0, 0.07),
                0 0 0 2px rgba(99, 102, 241, 0.1);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .card-header h2 {
    color: #1e293b;
    font-size: 1.25rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .icon {
    font-size: 2rem;
    background: linear-gradient(135deg, #6366f1, #818cf8);
    color: white;
    padding: 1rem;
    border-radius: 16px;
    box-shadow: 0 8px 16px rgba(99, 102, 241, 0.2);
    transform: rotate(-5deg);
  }

  .number {
    font-size: 4rem;
    font-weight: 800;
    margin: 0.75rem 0;
    background: linear-gradient(135deg, #4338ca 0%, #6366f1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
    letter-spacing: -2px;
  }

  .subtitle {
    color: #64748b;
    font-size: 0.95rem;
    font-weight: 500;
  }

  .trip-item, .delivery-item {
    display: flex;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    transition: all 0.2s ease;
  }

  .trip-item:hover, .delivery-item:hover {
    background: rgba(99, 102, 241, 0.03);
    transform: translateX(8px);
    border-radius: 12px;
  }

  .avatar {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #6366f1, #818cf8);
    color: white;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1.25rem;
    font-weight: 600;
    font-size: 1.1rem;
    box-shadow: 0 6px 12px rgba(99, 102, 241, 0.2);
    transform: rotate(-3deg);
  }

  .route {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1e293b;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .route::after {
    content: '→';
    color: #6366f1;
    font-weight: 700;
  }

  .details {
    color: #6366f1;
    font-size: 1rem;
    font-weight: 500;
  }

  .chip {
    padding: 0.7rem 1.4rem;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  .chip.success {
    background: linear-gradient(135deg, #059669, #10b981);
    color: white;
  }

  .chip.info {
    background: linear-gradient(135deg, #4338ca, #6366f1);
    color: white;
  }

  .section h2 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 1.75rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .section h2::before {
    content: '';
    display: block;
    width: 6px;
    height: 28px;
    background: linear-gradient(180deg, #6366f1, #818cf8);
    border-radius: 3px;
    transform: rotate(-5deg);
  }

  /* Scrollbar styling */
  .trips, .deliveries {
    max-height: 480px;
    overflow-y: auto;
  }

  .trips::-webkit-scrollbar, .deliveries::-webkit-scrollbar {
    width: 6px;
  }

  .trips::-webkit-scrollbar-track, .deliveries::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }

  .trips::-webkit-scrollbar-thumb, .deliveries::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  .trips::-webkit-scrollbar-thumb:hover, .deliveries::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }

  @media (max-width: 768px) {
    .dashboard {
      padding: 1rem;
    }

    .dashboard-title {
      font-size: 2rem;
    }

    .number {
      font-size: 2.5rem;
    }
  }
</style>

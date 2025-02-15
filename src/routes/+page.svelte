<script lang="ts">
  const icons = {
    truck: `<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
    </svg>`,
    people: `<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>`,
    chart: `<svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
      <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
    </svg>`
  };
</script>

<div class="dashboard">
  <h1 class="dashboard-title">Logistics Dashboard</h1>

  <!-- Summary Cards -->
  <div class="summary-cards">
    <div class="card">
      <div class="card-header">
        <span class="icon">
          {@html icons.truck}
        </span>
        <h2>Active Trips</h2>
      </div>
      <p class="number">24</p>
      <p class="subtitle">8 arriving today</p>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="icon">
          {@html icons.people}
        </span>
        <h2>Drivers on Duty</h2>
      </div>
      <p class="number">18</p>
      <p class="subtitle">85% of fleet active</p>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="icon">
          {@html icons.chart}
        </span>
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
    background-color: #f0f4ff;
    background-image: url("data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Cpath d='M96 36h-6l-6 6v6h6l6-6zM84 36H60v12h24zM56 36h-8v12h8zM40 36h-4v12h4zM96 52h-6l-6 6v6h6l6-6zM84 52H60v12h24zM56 52h-8v12h8zM40 52h-4v12h4z'/%3E%3Cpath d='M142 64h4v4h-4zM134 64h4v4h-4zM126 64h4v4h-4zM118 64h4v4h-4z'/%3E%3Cpath d='M96 84v-6l-6-6h-6v6l6 6zM84 84H60V72h24zM56 84h-8V72h8zM40 84h-4V72h4z'/%3E%3Cpath d='M142 96h4v4h-4zM134 96h4v4h-4zM126 96h4v4h-4zM118 96h4v4h-4z'/%3E%3Cpath d='M24 120v6l6 6h6v-6l-6-6zM60 120v12H36v-12zM88 120v12H64v-12zM104 120v12h-12v-12z'/%3E%3C/g%3E%3C/svg%3E"),
      url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='0.02'%3E%3Cpath d='M60 0l30 30-30 30L30 30zM0 60l30 30-30 30zM120 60l-30 30 30 30z'/%3E%3C/g%3E%3C/svg%3E");
    background-position: center;
    position: relative;
    color: #1e293b;
  }

  /* Add a subtle gradient overlay */
  .dashboard::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at top right, 
                rgba(99, 102, 241, 0.08) 0%, 
                transparent 50%),
              radial-gradient(circle at bottom left, 
                rgba(244, 63, 94, 0.08) 0%, 
                transparent 50%);
    pointer-events: none;
    z-index: -1;
  }

  /* Add floating logistics icons */
  .dashboard::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='0.02'%3E%3Cpath d='M50 0l10 10H40l10-10zm0 100l10-10H40l10 10zM0 50l10 10V40L0 50zm100 0l-10 10V40l10 10zM40 40h20v20H40z'/%3E%3C/g%3E%3C/svg%3E");
    animation: float 60s linear infinite;
    pointer-events: none;
    z-index: -1;
  }

  @keyframes float {
    from {
      transform: translateY(0) rotate(0deg);
    }
    to {
      transform: translateY(-100%) rotate(360deg);
    }
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
    display: flex;
    align-items: center;
    justify-content: center;
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
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    transition: all 0.2s ease;
    gap: 1rem;
  }

  .trip-item:last-child, .delivery-item:last-child {
    border-bottom: none;
  }

  .trip-item:hover, .delivery-item:hover {
    background: rgba(99, 102, 241, 0.03);
    transform: translateX(4px);
  }

  .trip-info, .delivery-info {
    flex: 1;
    min-width: 0;
  }

  .route {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #1e293b;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    min-width: max-content;
  }

  .avatar {
    min-width: 50px;
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
    white-space: nowrap;
  }

  .chip.success {
    background: linear-gradient(135deg, #059669, #10b981);
    color: white;
  }

  .chip.info {
    background: linear-gradient(135deg, #4338ca, #6366f1);
    color: white;
  }

  .section {
    margin-bottom: 2rem;
  }

  .section:last-child {
    margin-bottom: 0;
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

  .trips, .deliveries {
    max-height: 480px;
    overflow-y: auto;
    overflow-x: hidden;
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

    .trip-item, .delivery-item {
      padding: 1rem;
      gap: 0.75rem;
    }

    .route {
      font-size: 1rem;
    }

    .details {
      font-size: 0.9rem;
    }

    .chip {
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
    }

    .avatar {
      min-width: 40px;
      height: 40px;
      font-size: 1rem;
    }
  }
</style>

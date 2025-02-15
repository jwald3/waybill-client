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
    </svg>`,
    dashboard: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
    </svg>`,
    routes: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M3 3h18v2H3V3zm0 16h18v2H3v-2zm0-8h18v2H3v-2z"/>
    </svg>`,
    analytics: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1.57 16H6.57L12 13.4l2.19 2.19 2.44-2.44L19 15.73V19zm0-4.76l-2.37-2.37-2.44 2.44L12 12.12 6.57 17H5V5h14v9.24z"/>
    </svg>`,
    settings: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.03-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
    </svg>`
  };

  let isNavExpanded = true;
</script>

<div class="layout">
  <nav class:expanded={isNavExpanded}>
    <div class="nav-header">
      <button class="toggle-nav" on:click={() => isNavExpanded = !isNavExpanded}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
        </svg>
      </button>
      {#if isNavExpanded}
        <h1>Waybill</h1>
      {/if}
    </div>

    <div class="nav-links">
      <a href="/" class="nav-link active">
        <span class="nav-icon">{@html icons.dashboard}</span>
        {#if isNavExpanded}<span>Dashboard</span>{/if}
      </a>
      <a href="/routes" class="nav-link">
        <span class="nav-icon">{@html icons.routes}</span>
        {#if isNavExpanded}<span>Routes</span>{/if}
      </a>
      <a href="/analytics" class="nav-link">
        <span class="nav-icon">{@html icons.analytics}</span>
        {#if isNavExpanded}<span>Analytics</span>{/if}
      </a>
      <a href="/settings" class="nav-link">
        <span class="nav-icon">{@html icons.settings}</span>
        {#if isNavExpanded}<span>Settings</span>{/if}
      </a>
    </div>
  </nav>

  <main>
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
                <div class="eta-container">
                  <svg class="clock-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                  </svg>
                  <span class="eta-text">2:30 PM</span>
                </div>
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
  </main>
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
    gap: 0.5rem;
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

  .eta-container {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: #64748b;
    font-size: 0.9rem;
    font-weight: 500;
    background: #f8fafc;
    padding: 0.4rem 0.8rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .clock-icon {
    color: #6366f1;
  }

  .eta-text {
    letter-spacing: 0.5px;
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

    .eta-container {
      font-size: 0.85rem;
      padding: 0.3rem 0.6rem;
    }
  }

  .layout {
    display: flex;
    min-height: 100vh;
  }

  nav {
    background: white;
    width: 80px;
    transition: width 0.3s ease;
    border-right: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  nav.expanded {
    width: 240px;
  }

  .nav-header {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .nav-header h1 {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1e293b;
    white-space: nowrap;
  }

  .toggle-nav {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .toggle-nav:hover {
    background: #f1f5f9;
    color: #1e293b;
  }

  .nav-links {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    color: #64748b;
    text-decoration: none;
    border-radius: 12px;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .nav-link:hover {
    background: #f1f5f9;
    color: #1e293b;
  }

  .nav-link.active {
    background: #818cf8;
    color: white;
  }

  .nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  main {
    flex: 1;
    background: #f0f4ff;
    min-width: 0;
  }

  @media (max-width: 768px) {
    nav {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: auto;
      border-right: none;
      border-top: 1px solid #e2e8f0;
      z-index: 100;
    }

    nav.expanded {
      width: 100%;
    }

    .nav-header {
      display: none;
    }

    .nav-links {
      flex-direction: row;
      justify-content: space-around;
      padding: 0.5rem;
    }

    .nav-link {
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.75rem;
      font-size: 0.8rem;
    }

    main {
      padding-bottom: 80px;
    }
  }
</style>

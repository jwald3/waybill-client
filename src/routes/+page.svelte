<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import Chip from '$lib/components/Chip.svelte';
  import { icons } from '$lib/icons';
  import { onMount } from 'svelte';
  import { getTrips } from '$lib/api/trips';
  import { getDrivers } from '$lib/api/drivers';
  import type { Trip } from '$lib/api/trips';
  import type { Driver } from '$lib/api/drivers';

  let isNavExpanded = true;
  let trips: Trip[] = [];
  let drivers: Driver[] = [];
  let loading = true;

  onMount(async () => {
    try {
      const [tripsResponse, driversResponse] = await Promise.all([
        getTrips(),
        getDrivers()
      ]);

      trips = tripsResponse.items;
      drivers = driversResponse.items;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      loading = false;
    }
  });

  // Compute active trips (those with status IN_PROGRESS)
  $: activeTrips = trips.filter(trip => trip.status === 'IN_PROGRESS');
  
  // Compute active drivers (those with ACTIVE status)
  $: activeDrivers = drivers.filter(driver => driver.employment_status === 'ACTIVE');
  
  // Get completed trips, sorted by completion date
  $: completedTrips = trips
    .filter(trip => trip.status === 'COMPLETED' && trip.arrival_time.actual)
    .sort((a, b) => new Date(b.arrival_time.actual!).getTime() - new Date(a.arrival_time.actual!).getTime())
    .slice(0, 5); // Show only the 5 most recent

  // Calculate on-time delivery percentage
  $: onTimeDeliveries = trips
    .filter(trip => trip.status === 'COMPLETED')
    .filter(trip => {
      if (!trip.arrival_time.actual || !trip.arrival_time.scheduled) return false;
      const actual = new Date(trip.arrival_time.actual);
      const scheduled = new Date(trip.arrival_time.scheduled);
      return actual <= scheduled;
    });

  $: onTimePercentage = trips.length > 0 
    ? Math.round((onTimeDeliveries.length / trips.filter(t => t.status === 'COMPLETED').length) * 100) 
    : 0;

  // Helper function to format date/time
  function formatTime(isoString: string): string {
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  // Helper function to format date
  function formatDate(isoString: string): string {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  // Helper to calculate if a trip is on schedule
  function isOnSchedule(trip: Trip): boolean {
    const now = new Date();
    const scheduled = new Date(trip.arrival_time.scheduled);
    return now <= scheduled;
  }
</script>

<svelte:head>
  <title>Dashboard | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
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
        <p class="number">{activeTrips.length}</p>
        <p class="subtitle">{trips.filter(t => t.status === 'COMPLETED').length} completed total</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="icon">
            {@html icons.people}
          </span>
          <h2>Drivers on Duty</h2>
        </div>
        <p class="number">{activeDrivers.length}</p>
        <p class="subtitle">{Math.round((activeDrivers.length / drivers.length) * 100)}% of fleet active</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="icon">
            {@html icons.chart}
          </span>
          <h2>Delivery Performance</h2>
        </div>
        <p class="number">{onTimePercentage}%</p>
        <p class="subtitle">On-time delivery rate</p>
      </div>
    </div>

    <!-- Active Trips -->
    <Card title="Active Trips" icon={icons.truck} class="section">
      <div class="trips">
        {#if loading}
          <div class="loading">Loading trips...</div>
        {:else if activeTrips.length === 0}
          <div class="empty-state">No active trips at the moment</div>
        {:else}
          {#each activeTrips as trip}
            <a href="/trips/{trip.id}" class="trip-item">
              <div class="avatar">
                {trip.trip_number.slice(0, 2)}
              </div>
              <div class="trip-info">
                <p class="route">Trip #{trip.trip_number}</p>
                <p class="details">
                  {trip.cargo.description} • {trip.cargo.weight.toLocaleString()}lbs
                  {#if trip.cargo.hazmat}
                    <Chip variant="error" size="small">HAZMAT</Chip>
                  {/if}
                </p>
              </div>
              <div class="status">
                <Chip variant={isOnSchedule(trip) ? 'success' : 'warning'}>
                  {isOnSchedule(trip) ? 'On Schedule' : 'Delayed'}
                </Chip>
                <div class="eta-container">
                  <svg class="clock-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                  </svg>
                  <span class="eta-text">ETA: {formatTime(trip.arrival_time.scheduled)}</span>
                </div>
              </div>
            </a>
          {/each}
        {/if}
      </div>
    </Card>

    <!-- Recent Deliveries -->
    <Card title="Recent Deliveries" icon={icons.truck} class="section">
      <div class="deliveries">
        {#if loading}
          <div class="loading">Loading deliveries...</div>
        {:else if completedTrips.length === 0}
          <div class="empty-state">No completed deliveries yet</div>
        {:else}
          {#each completedTrips as trip}
            <a href="/trips/{trip.id}" class="delivery-item">
              <div class="avatar">
                {trip.trip_number.slice(0, 2)}
              </div>
              <div class="delivery-info">
                <p class="route">Trip #{trip.trip_number}</p>
                <p class="details">
                  {trip.cargo.description} • Completed {formatDate(trip.arrival_time.actual || '')} at {formatTime(trip.arrival_time.actual || '')}
                </p>
              </div>
              <Chip variant="info">Delivered</Chip>
            </a>
          {/each}
        {/if}
      </div>
    </Card>
  </div>
</Layout>

<style>
  :global(body) {
    background-color: var(--bg-primary);
    background-image: url("data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='var(--text-secondary)' fill-opacity='0.03'%3E%3Cpath d='M96 36h-6l-6 6v6h6l6-6zM84 36H60v12h24zM56 36h-8v12h8zM40 36h-4v12h4zM96 52h-6l-6 6v6h6l6-6zM84 52H60v12h24zM56 52h-8v12h8zM40 52h-4v12h4z'/%3E%3Cpath d='M142 64h4v4h-4zM134 64h4v4h-4zM126 64h4v4h-4zM118 64h4v4h-4z'/%3E%3Cpath d='M96 84v-6l-6-6h-6v6l6 6zM84 84H60V72h24zM56 84h-8V72h8zM40 84h-4V72h4z'/%3E%3Cpath d='M142 96h4v4h-4zM134 96h4v4h-4zM126 96h4v4h-4zM118 96h4v4h-4z'/%3E%3Cpath d='M24 120v6l6 6h6v-6l-6-6zM60 120v12H36v-12zM88 120v12H64v-12zM104 120v12h-12v-12z'/%3E%3C/g%3E%3C/svg%3E");
    color: var(--text-primary);
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
                color-mix(in srgb, var(--theme-color) 8%, transparent) 0%, 
                transparent 50%),
              radial-gradient(circle at bottom left, 
                color-mix(in srgb, var(--theme-color) 8%, transparent) 0%, 
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
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='var(--theme-color)' fill-opacity='0.02'%3E%3Cpath d='M50 0l10 10H40l10-10zm0 100l10-10H40l10 10zM0 50l10 10V40L0 50zm100 0l-10 10V40l10 10zM40 40h20v20H40z'/%3E%3C/g%3E%3C/svg%3E");
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
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .dashboard-title {
    font-size: 3rem;
    margin-bottom: 3rem;
    color: var(--text-primary);
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
    background: var(--theme-gradient);
    border-radius: 3px;
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .card {
    background: var(--bg-secondary);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02),
                0 12px 16px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    border: 1px solid var(--border-color);
  }

  .card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: var(--theme-gradient);
  }

  .card:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.06),
                0 20px 30px rgba(0, 0, 0, 0.07),
                0 0 0 2px color-mix(in srgb, var(--theme-color) 10%, transparent);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .card-header h2 {
    color: var(--text-primary);
    font-size: 1.25rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--theme-gradient);
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
    background: var(--theme-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    line-height: 1;
    letter-spacing: -2px;
  }

  .subtitle {
    color: var(--text-secondary);
    font-size: 0.95rem;
    font-weight: 500;
  }

  .trip-item, .delivery-item {
    display: flex;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
    transition: all 0.2s ease;
    gap: 1rem;
    text-decoration: none;
    color: inherit;
  }

  .trip-item:last-child, .delivery-item:last-child {
    border-bottom: none;
  }

  .trip-item:hover, .delivery-item:hover {
    background: color-mix(in srgb, var(--theme-color) 3%, var(--surface-color));
    transform: translateX(4px);
    border-color: var(--theme-color);
  }

  .trip-info, .delivery-info {
    flex: 1;
    min-width: 0;
  }

  .route {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
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
    background: var(--theme-gradient);
    color: white;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1.25rem;
    font-weight: 600;
    font-size: 1.1rem;
    box-shadow: 0 6px 12px color-mix(in srgb, var(--theme-color) 20%, transparent);
    transform: rotate(-3deg);
  }

  .details {
    color: var(--text-secondary);
    font-size: 1rem;
    font-weight: 500;
  }

  .eta-container {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
    font-weight: 500;
    background: var(--surface-color);
    padding: 0.4rem 0.8rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }

  .clock-icon {
    color: var(--theme-color);
  }

  .eta-text {
    letter-spacing: 0.5px;
  }

  .section {
    margin-bottom: 0;
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
    background: var(--theme-gradient);
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

  @media (min-width: 769px) and (max-width: 1200px) {
    .dashboard {
      padding: 1.5rem;
      gap: 1.5rem;
    }

    .dashboard-title {
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }

    .summary-cards {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.25rem;
    }

    .card {
      padding: 1.75rem;
    }

    .number {
      font-size: 3.5rem;
    }

    .trip-item, .delivery-item {
      padding: 1.25rem;
      gap: 1rem;
    }

    .avatar {
      min-width: 48px;
      height: 48px;
      margin-right: 1rem;
    }

    .route {
      font-size: 1.05rem;
      margin-bottom: 0.35rem;
    }

    .status {
      gap: 0.75rem;
    }

    .eta-container {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
      min-width: 110px;
    }

    .section {
      margin-bottom: 1.5rem;
    }

    .section h2 {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    .dashboard {
      padding: 1rem;
      gap: 1rem;
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

  .route-meta {
    color: var(--theme-color);
  }

  .tool-button:hover {
    border-color: var(--theme-color);
    color: var(--theme-color);
  }

  /* Update the background patterns for dark mode */
  [data-color-mode="dark"] :global(body) {
    background-image: url("data:image/svg+xml,%3Csvg width='160' height='160' viewBox='0 0 160 160' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M96 36h-6l-6 6v6h6l6-6zM84 36H60v12h24zM56 36h-8v12h8zM40 36h-4v12h4zM96 52h-6l-6 6v6h6l6-6zM84 52H60v12h24zM56 52h-8v12h8zM40 52h-4v12h4z'/%3E%3Cpath d='M142 64h4v4h-4zM134 64h4v4h-4zM126 64h4v4h-4zM118 64h4v4h-4z'/%3E%3Cpath d='M96 84v-6l-6-6h-6v6l6 6zM84 84H60V72h24zM56 84h-8V72h8zM40 84h-4V72h4z'/%3E%3Cpath d='M142 96h4v4h-4zM134 96h4v4h-4zM126 96h4v4h-4zM118 96h4v4h-4z'/%3E%3Cpath d='M24 120v6l6 6h6v-6l-6-6zM60 120v12H36v-12zM88 120v12H64v-12zM104 120v12h-12v-12z'/%3E%3C/g%3E%3C/svg%3E");
  }

  /* Update the gradient overlay for dark mode */
  [data-color-mode="dark"] .dashboard::before {
    background: radial-gradient(circle at top right, 
                rgba(99, 102, 241, 0.1) 0%, 
                transparent 50%),
              radial-gradient(circle at bottom left, 
                rgba(99, 102, 241, 0.1) 0%, 
                transparent 50%);
  }

  /* Update box shadows for dark mode */
  [data-color-mode="dark"] .card {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1),
                0 12px 16px rgba(0, 0, 0, 0.1);
  }

  .loading, .empty-state {
    padding: 2rem;
    text-align: center;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .empty-state {
    background: var(--surface-color);
    border-radius: 12px;
    border: 1px dashed var(--border-color);
  }
</style>

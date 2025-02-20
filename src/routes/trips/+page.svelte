<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  
  let isNavExpanded = true;

  interface TripNote {
    note_timestamp: string;
    content: string;
  }

  interface Trip {
    id: string;
    trip_number: string;
    departure_time: {
      scheduled: string;
      actual?: string;
    };
    arrival_time: {
      scheduled: string;
      actual?: string;
    };
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
    cargo: {
      description: string;
      weight: number;
      hazmat: boolean;
    };
    fuel_usage_gallons: number;
    distance_miles: number;
    notes: TripNote[];
    created_at: string;
    updated_at: string;
  }

  // Generate sample trips based on API structure
  const trips: Trip[] = Array.from({ length: 15 }, (_, i): Trip => ({
    id: `trip_${i + 1}`,
    trip_number: `${209100240 + i}`,
    departure_time: {
      scheduled: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)).toISOString(),
      actual: i < 5 ? new Date(Date.now() + (i * 22 * 60 * 60 * 1000)).toISOString() : undefined
    },
    arrival_time: {
      scheduled: new Date(Date.now() + ((i + 4) * 24 * 60 * 60 * 1000)).toISOString(),
      actual: i < 3 ? new Date(Date.now() + ((i + 4) * 23 * 60 * 60 * 1000)).toISOString() : undefined
    },
    status: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'][i % 4],
    cargo: {
      description: [
        'Electronics and Components',
        'Construction Materials',
        'Food Products',
        'Medical Supplies',
        'Automotive Parts'
      ][i % 5],
      weight: 20000 + Math.random() * 15000,
      hazmat: i % 7 === 0
    },
    fuel_usage_gallons: 300 + Math.random() * 200,
    distance_miles: 1500 + Math.random() * 2000,
    notes: Array.from({ length: 1 + (i % 3) }, (_, j) => ({
      note_timestamp: new Date(Date.now() - (j * 60 * 60 * 1000)).toISOString(),
      content: [
        'On schedule and proceeding as planned',
        'Minor delay due to weather conditions',
        'Route adjusted to avoid construction',
        'Fuel stop completed',
        'Load secured and checked'
      ][j % 5]
    })),
    created_at: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    updated_at: new Date(Date.now() - (i * 12 * 60 * 60 * 1000)).toISOString()
  }));

  // Calculate statistics
  const stats = {
    active: trips.filter(t => t.status === 'IN_PROGRESS').length,
    scheduled: trips.filter(t => t.status === 'SCHEDULED').length,
    completed: trips.filter(t => t.status === 'COMPLETED').length,
    totalMiles: trips.reduce((sum, trip) => sum + trip.distance_miles, 0),
    totalFuel: trips.reduce((sum, trip) => sum + trip.fuel_usage_gallons, 0)
  };

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  }

  function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  }
</script>

<Layout {isNavExpanded}>
  <div class="trips">
    <h1 class="trips-title">Trip Management</h1>

    <div class="stats-grid">
      <Card title="Active Trips" icon={icons.trips}>
        <div class="stat-content">
          <p class="stat-number">{stats.active}</p>
          <p class="stat-label">In Progress</p>
        </div>
      </Card>

      <Card title="Scheduled" icon={icons.trips}>
        <div class="stat-content">
          <p class="stat-number">{stats.scheduled}</p>
          <p class="stat-label">Upcoming</p>
        </div>
      </Card>

      <Card title="Total Distance" icon={icons.trips}>
        <div class="stat-content">
          <p class="stat-number">{formatNumber(stats.totalMiles)}</p>
          <p class="stat-label">Miles</p>
        </div>
      </Card>

      <Card title="Fuel Usage" icon={icons.trips}>
        <div class="stat-content">
          <p class="stat-number">{formatNumber(stats.totalFuel)}</p>
          <p class="stat-label">Gallons</p>
        </div>
      </Card>
    </div>

    <Card title="Active Trips" icon={icons.trips}>
      <div class="trips-list">
        {#each trips as trip}
          <div class="trip-item">
            <div class="trip-header">
              <div class="trip-title">
                <h3>Trip #{trip.trip_number}</h3>
                <span class="status-badge {trip.status.toLowerCase()}">
                  {trip.status.replace('_', ' ')}
                </span>
              </div>
              {#if trip.cargo.hazmat}
                <span class="hazmat-badge">HAZMAT</span>
              {/if}
            </div>

            <div class="trip-details">
              <div class="detail-group">
                <div class="detail">
                  <span class="label">Departure:</span>
                  <span class="value">{formatDate(trip.departure_time.scheduled)}</span>
                  {#if trip.departure_time.actual}
                    <span class="actual-time">Actual: {formatDate(trip.departure_time.actual)}</span>
                  {/if}
                </div>
                <div class="detail">
                  <span class="label">Arrival:</span>
                  <span class="value">{formatDate(trip.arrival_time.scheduled)}</span>
                  {#if trip.arrival_time.actual}
                    <span class="actual-time">Actual: {formatDate(trip.arrival_time.actual)}</span>
                  {/if}
                </div>
              </div>

              <div class="detail-group">
                <div class="detail">
                  <span class="label">Cargo:</span>
                  <span class="value">{trip.cargo.description}</span>
                  <span class="sub-value">{formatNumber(trip.cargo.weight)} lbs</span>
                </div>
                <div class="detail">
                  <span class="label">Distance:</span>
                  <span class="value">{formatNumber(trip.distance_miles)} miles</span>
                  <span class="sub-value">{formatNumber(trip.fuel_usage_gallons)} gal. fuel</span>
                </div>
              </div>
            </div>

            {#if trip.notes.length > 0}
              <div class="trip-notes">
                <h4>Notes:</h4>
                {#each trip.notes as note}
                  <div class="note">
                    <span class="note-time">{formatDate(note.note_timestamp)}</span>
                    <p>{note.content}</p>
                  </div>
                {/each}
              </div>
            {/if}

            <div class="trip-actions">
              <button class="action-button">View Details</button>
              <button class="action-button">Update Status</button>
              <button class="action-button">Add Note</button>
            </div>
          </div>
        {/each}
      </div>
    </Card>
  </div>
</Layout>

<style>
  .trips {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .trips-title {
    font-size: 3rem;
    margin-bottom: 3rem;
    color: var(--text-primary);
    font-weight: 800;
    position: relative;
    letter-spacing: -1px;
  }

  .trips-title::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 100px;
    height: 6px;
    background: var(--theme-gradient);
    border-radius: 3px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
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
  }

  .trips-list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.5rem;
  }

  .trip-item {
    background: var(--bg-secondary);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid var(--border-color);
    transition: all 0.2s ease;
  }

  .trip-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border-color: var(--theme-color);
  }

  .trip-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .trip-title {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .trip-title h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-badge.scheduled {
    background: #dbeafe;
    color: #2563eb;
  }

  .status-badge.in_progress {
    background: #fef3c7;
    color: #d97706;
  }

  .status-badge.completed {
    background: #dcfce7;
    color: #059669;
  }

  .status-badge.canceled {
    background: #fee2e2;
    color: #dc2626;
  }

  .hazmat-badge {
    background: #fecaca;
    color: #b91c1c;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .trip-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .detail-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .detail {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .label {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .value {
    font-weight: 500;
    color: var(--text-primary);
  }

  .sub-value {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .actual-time {
    font-size: 0.875rem;
    color: var(--theme-color);
    font-style: italic;
  }

  .trip-notes {
    background: color-mix(in srgb, var(--theme-color) 5%, var(--bg-secondary));
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .trip-notes h4 {
    color: var(--text-primary);
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .note {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem;
    border-radius: 6px;
    background: var(--bg-secondary);
    margin-bottom: 0.5rem;
  }

  .note:last-child {
    margin-bottom: 0;
  }

  .note-time {
    font-size: 0.8rem;
    color: var(--text-secondary);
  }

  .note p {
    color: var(--text-primary);
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .trip-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .action-button {
    padding: 0.625rem 1.25rem;
    background: color-mix(in srgb, var(--theme-color) 5%, var(--bg-secondary));
    border: 1px solid color-mix(in srgb, var(--theme-color) 15%, var(--border-color));
    border-radius: 8px;
    color: var(--theme-color);
    font-weight: 500;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .action-button:hover {
    background: var(--theme-color);
    color: white;
  }

  @media (max-width: 768px) {
    .trips {
      padding: 1rem;
    }

    .trips-title {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .trip-item {
      padding: 1rem;
    }

    .trip-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .trip-details {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .trip-actions {
      flex-direction: column;
    }

    .action-button {
      width: 100%;
      text-align: center;
    }

    .note {
      padding: 0.5rem;
    }
  }
</style> 
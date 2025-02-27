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

  // Pagination settings
  let currentPage = 1;
  const recordsPerPage = 5;

  // Search and filter state
  let searchQuery = '';
  let selectedStatus: string = 'ALL';
  let sortField: 'departure_time' | 'arrival_time' | 'trip_number' = 'departure_time';
  let sortDirection: 'asc' | 'desc' = 'desc';

  // Status options
  const statusTypes = ['ALL', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'];

  // Filtered and sorted records
  $: filteredRecords = trips
    .filter(trip => {
      const matchesSearch = searchQuery === '' || 
        trip.trip_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.cargo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === 'ALL' || 
        trip.status === selectedStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'departure_time':
          comparison = new Date(b.departure_time.scheduled).getTime() - new Date(a.departure_time.scheduled).getTime();
          break;
        case 'arrival_time':
          comparison = new Date(b.arrival_time.scheduled).getTime() - new Date(a.arrival_time.scheduled).getTime();
          break;
        case 'trip_number':
          comparison = a.trip_number.localeCompare(b.trip_number);
          break;
      }
      return sortDirection === 'asc' ? -comparison : comparison;
    });

  // Update filtered records to include pagination
  $: paginatedRecords = filteredRecords
    .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);

  $: totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Reset to first page when filters change
  $: if (searchQuery || selectedStatus) {
    currentPage = 1;
  }

  function handleSort(field: typeof sortField) {
    if (sortField === field) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field;
      sortDirection = 'desc';
    }
  }

  function formatStatusLabel(status: string): string {
    if (status === 'ALL') return 'All Statuses';
    return status.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }
</script>

<svelte:head>
  <title>Trip Management | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    <h1 class="page-title">Trip Management</h1>

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

    <Card title="Trip Records" icon={icons.trips}>
      <div class="controls">
        <div class="search-box">
          <input
            type="text"
            placeholder="Search trips..."
            bind:value={searchQuery}
            class="search-input"
          />
          <span class="search-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </span>
        </div>

        <div class="filter-group">
          <select 
            bind:value={selectedStatus}
            class="filter-select"
          >
            {#each statusTypes as type}
              <option value={type}>{formatStatusLabel(type)}</option>
            {/each}
          </select>

          <div class="sort-buttons">
            <button
              class="sort-button"
              class:active={sortField === 'departure_time'}
              class:asc={sortField === 'departure_time' && sortDirection === 'asc'}
              on:click={() => handleSort('departure_time')}
            >
              Departure {sortField === 'departure_time' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </button>
            <button
              class="sort-button"
              class:active={sortField === 'arrival_time'}
              class:asc={sortField === 'arrival_time' && sortDirection === 'asc'}
              on:click={() => handleSort('arrival_time')}
            >
              Arrival {sortField === 'arrival_time' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </button>
            <button
              class="sort-button"
              class:active={sortField === 'trip_number'}
              class:asc={sortField === 'trip_number' && sortDirection === 'asc'}
              on:click={() => handleSort('trip_number')}
            >
              Trip # {sortField === 'trip_number' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </button>
          </div>
        </div>

        <a href="/trips/new" class="action-button primary">
          Create Trip
        </a>
      </div>

      <div class="results-summary">
        Showing {filteredRecords.length} of {trips.length} trips
      </div>

      <div class="records-list">
        {#each paginatedRecords as trip}
          <div class="record-item">
            <div class="record-header">
              <div class="record-title">
                <h3>Trip #{trip.trip_number}</h3>
                <span class="status-badge {trip.status.toLowerCase()}">
                  {trip.status.replace('_', ' ')}
                </span>
              </div>
              {#if trip.cargo.hazmat}
                <span class="hazmat-badge">HAZMAT</span>
              {/if}
            </div>

            <div class="record-details">
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

            <div class="record-actions">
              <button class="action-button">View Details</button>
              <button class="action-button">Update Status</button>
              <button class="action-button">Add Note</button>
            </div>
          </div>
        {/each}
      </div>

      <div class="pagination">
        <div class="pagination-info">
          Showing {(currentPage - 1) * recordsPerPage + 1} to {Math.min(currentPage * recordsPerPage, filteredRecords.length)} of {filteredRecords.length} trips
        </div>
        <div class="pagination-controls">
          <button 
            class="page-button"
            disabled={currentPage === 1}
            on:click={() => goToPage(1)}
            title="First page"
          >
            ««
          </button>
          <button 
            class="page-button"
            disabled={currentPage === 1}
            on:click={() => goToPage(currentPage - 1)}
            title="Previous page"
          >
            «
          </button>
          
          {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
            {#if page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)}
              <button 
                class="page-button"
                class:active={page === currentPage}
                on:click={() => goToPage(page)}
              >
                {page}
              </button>
            {:else if page === currentPage - 3 || page === currentPage + 3}
              <span class="page-ellipsis">...</span>
            {/if}
          {/each}

          <button 
            class="page-button"
            disabled={currentPage === totalPages}
            on:click={() => goToPage(currentPage + 1)}
            title="Next page"
          >
            »
          </button>
          <button 
            class="page-button"
            disabled={currentPage === totalPages}
            on:click={() => goToPage(totalPages)}
            title="Last page"
          >
            »»
          </button>
        </div>
      </div>
    </Card>
  </div>
</Layout>

<style>
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

  .detail-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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

  @media (max-width: 768px) {
    .note {
      padding: 0.5rem;
    }
  }
</style> 
<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import { formatLargeNumber, formatDate } from '$lib/utils/format';
  
  let isNavExpanded = true;

  interface Trip {
    _id: string;
    trip_number: string;
    status: string;
  }

  interface Truck {
    id: string;
    truck_number: string;
    make: string;
    model: string;
  }

  interface Driver {
    _id: string;
    first_name: string;
    last_name: string;
  }

  interface IncidentReport {
    id: string;
    trip: Trip;
    truck: Truck;
    driver: Driver;
    type: 'TRAFFIC_ACCIDENT' | 'MECHANICAL_FAILURE' | 'WEATHER_DELAY' | 'CARGO_ISSUE' | 'OTHER';
    description: string;
    date: string;
    location: string;
    damage_estimate: number;
    created_at: string;
    updated_at: string;
  }

  // Generate sample incidents
  const incidents: IncidentReport[] = Array.from({ length: 15 }, (_, i): IncidentReport => ({
    id: `incident_${i + 1}`,
    trip: {
      _id: `trip_${i + 1}`,
      trip_number: `${String(209100240 + i)}`,
      status: ['IN_PROGRESS', 'COMPLETED', 'CANCELED'][i % 3]
    },
    truck: {
      id: `truck_${i + 1}`,
      truck_number: `A${String(236286 + i)}`,
      make: ['Freightliner', 'Peterbilt', 'Kenworth'][i % 3],
      model: ['Cascadia', '579', 'T680'][i % 3]
    },
    driver: {
      _id: `driver_${i + 1}`,
      first_name: ['John', 'Jane', 'Mike', 'Sarah'][i % 4],
      last_name: ['Smith', 'Johnson', 'Williams', 'Brown'][i % 4]
    },
    type: ['TRAFFIC_ACCIDENT', 'MECHANICAL_FAILURE', 'WEATHER_DELAY', 'CARGO_ISSUE', 'OTHER'][i % 5],
    description: [
      'Driver ran into large debris left in the road',
      'Engine malfunction during transit',
      'Severe weather conditions caused delay',
      'Cargo shifted during transport',
      'Minor fender bender in parking lot'
    ][i % 5],
    date: new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    location: [
      'Albany, NY',
      'Syracuse, NY',
      'Buffalo, NY',
      'Rochester, NY',
      'Yonkers, NY'
    ][i % 5],
    damage_estimate: Math.round((5000 + Math.random() * 15000) * 100) / 100,
    created_at: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    updated_at: new Date(Date.now() - (i * 12 * 60 * 60 * 1000)).toISOString()
  }));

  // Stats calculation
  const stats = {
    total: incidents.length,
    totalDamage: formatLargeNumber(
      incidents.reduce((sum, inc) => sum + inc.damage_estimate, 0)
    ),
    byType: {
      accidents: incidents.filter(i => i.type === 'TRAFFIC_ACCIDENT').length,
      mechanical: incidents.filter(i => i.type === 'MECHANICAL_FAILURE').length,
      weather: incidents.filter(i => i.type === 'WEATHER_DELAY').length,
      cargo: incidents.filter(i => i.type === 'CARGO_ISSUE').length,
      other: incidents.filter(i => i.type === 'OTHER').length
    }
  };

  // Pagination settings
  let currentPage = 1;
  const recordsPerPage = 5;

  // Search and filter state
  let searchQuery = '';
  let selectedType: string = 'ALL';
  let sortField: 'date' | 'damage_estimate' | 'type' = 'date';
  let sortDirection: 'asc' | 'desc' = 'desc';

  // Incident types for filtering
  const incidentTypes = ['ALL', 'TRAFFIC_ACCIDENT', 'MECHANICAL_FAILURE', 'WEATHER_DELAY', 'CARGO_ISSUE', 'OTHER'];

  // Filtered and sorted records
  $: filteredRecords = incidents
    .filter(incident => {
      const matchesSearch = searchQuery === '' || 
        incident.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.truck.truck_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${incident.driver.first_name} ${incident.driver.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'ALL' || incident.type === selectedType;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case 'damage_estimate':
          comparison = b.damage_estimate - a.damage_estimate;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      return sortDirection === 'asc' ? -comparison : comparison;
    });

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
  $: if (searchQuery || selectedType) {
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
</script>

<Layout {isNavExpanded}>
  <div class="incidents">
    <h1 class="incidents-title">Incident Reports</h1>

    <div class="stats-grid">
      <Card title="Total Incidents" icon={icons.maintenance}>
        <div class="stat">
          <p class="stat-value">{stats.total}</p>
          <p class="stat-label">Reported Incidents</p>
        </div>
      </Card>

      <Card title="Total Damage" icon={icons.maintenance}>
        <div class="stat">
          <p class="stat-value">{stats.totalDamage}</p>
          <p class="stat-label">Estimated Costs</p>
        </div>
      </Card>

      <Card title="Incident Types" icon={icons.maintenance}>
        <div class="stat">
          <div class="type-stats">
            <div class="type-stat type-accident">
              <span class="type-label">Accidents</span>
              <span class="type-value">{stats.byType.accidents}</span>
            </div>
            <div class="type-stat type-mechanical">
              <span class="type-label">Mechanical</span>
              <span class="type-value">{stats.byType.mechanical}</span>
            </div>
            <div class="type-stat type-weather">
              <span class="type-label">Weather</span>
              <span class="type-value">{stats.byType.weather}</span>
            </div>
            <div class="type-stat type-cargo">
              <span class="type-label">Cargo</span>
              <span class="type-value">{stats.byType.cargo}</span>
            </div>
            <div class="type-stat type-other">
              <span class="type-label">Other</span>
              <span class="type-value">{stats.byType.other}</span>
            </div>
          </div>
          <p class="stat-label">Distribution by Type</p>
        </div>
      </Card>
    </div>

    <Card title="Incident Records" icon={icons.maintenance}>
      <div class="controls">
        <div class="search-box">
          <input
            type="text"
            class="search-input"
            placeholder="Search incidents..."
            bind:value={searchQuery}
          />
          <span class="search-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </span>
        </div>

        <div class="filter-group">
          <select 
            bind:value={selectedType}
            class="filter-select"
          >
            {#each incidentTypes as type}
              <option value={type}>{type === 'ALL' ? 'All Types' : type.replace('_', ' ')}</option>
            {/each}
          </select>

          <div class="sort-buttons">
            <button
              class="sort-button"
              class:active={sortField === 'date'}
              on:click={() => handleSort('date')}
            >
              Date {sortField === 'date' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </button>
            <button
              class="sort-button"
              class:active={sortField === 'damage_estimate'}
              on:click={() => handleSort('damage_estimate')}
            >
              Damage {sortField === 'damage_estimate' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </button>
            <button
              class="sort-button"
              class:active={sortField === 'type'}
              on:click={() => handleSort('type')}
            >
              Type {sortField === 'type' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </button>
          </div>
        </div>
      </div>

      <div class="results-summary">
        Showing {paginatedRecords.length} of {filteredRecords.length} incidents
      </div>

      <div class="incidents-list">
        {#each paginatedRecords as incident}
          <div class="incident-item">
            <div class="incident-header">
              <div class="incident-title">
                <span class="incident-type {incident.type.toLowerCase()}">{incident.type.replace('_', ' ')}</span>
                <span class="incident-date">{formatDate(incident.date)}</span>
              </div>
              <div class="incident-damage">
                {formatLargeNumber(incident.damage_estimate)}
              </div>
            </div>

            <div class="incident-details">
              <div class="detail-group">
                <span class="label">Description</span>
                <span class="value">{incident.description}</span>
              </div>

              <div class="detail-group">
                <span class="label">Location</span>
                <span class="value">{incident.location}</span>
              </div>

              <div class="detail-group">
                <span class="label">Driver</span>
                <span class="value">{incident.driver.first_name} {incident.driver.last_name}</span>
              </div>

              <div class="detail-group">
                <span class="label">Vehicle</span>
                <span class="value">{incident.truck.make} {incident.truck.model}</span>
                <span class="sub-value">{incident.truck.truck_number}</span>
              </div>

              <div class="detail-group">
                <span class="label">Trip</span>
                <span class="value">{incident.trip.trip_number}</span>
                <span class="sub-value">{incident.trip.status}</span>
              </div>
            </div>

            <div class="incident-actions">
              <button class="action-button">View Details</button>
              <button class="action-button">Update Report</button>
            </div>
          </div>
        {/each}
      </div>

      {#if totalPages > 1}
        <div class="pagination">
          <div class="pagination-controls">
            <button
              class="page-button"
              disabled={currentPage === 1}
              on:click={() => goToPage(currentPage - 1)}
            >
              Previous
            </button>

            {#each Array(totalPages) as _, i}
              {#if i + 1 === 1 || i + 1 === totalPages || (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1)}
                <button
                  class="page-button"
                  class:active={currentPage === i + 1}
                  on:click={() => goToPage(i + 1)}
                >
                  {i + 1}
                </button>
              {:else if i + 1 === currentPage - 2 || i + 1 === currentPage + 2}
                <span class="page-ellipsis">...</span>
              {/if}
            {/each}

            <button
              class="page-button"
              disabled={currentPage === totalPages}
              on:click={() => goToPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      {/if}
    </Card>
  </div>
</Layout>

<style>
  .incidents {
    padding: 2rem;
  }

  .incidents-title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 2.5rem;
    color: var(--text-primary);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .stat {
    text-align: center;
  }

  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .type-stats {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .type-stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-weight: 500;
  }

  .type-stat.type-accident {
    background: color-mix(in srgb, #dc2626 10%, transparent);
    color: #dc2626;
  }

  .type-stat.type-mechanical {
    background: color-mix(in srgb, #2563eb 10%, transparent);
    color: #2563eb;
  }

  .type-stat.type-weather {
    background: color-mix(in srgb, #9333ea 10%, transparent);
    color: #9333ea;
  }

  .type-stat.type-cargo {
    background: color-mix(in srgb, #16a34a 10%, transparent);
    color: #16a34a;
  }

  .type-stat.type-other {
    background: color-mix(in srgb, #71717a 10%, transparent);
    color: #71717a;
  }

  .type-label {
    font-size: 1rem;
  }

  .type-value {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .incidents-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }

  .incident-item {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
  }

  .incident-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
  }

  .incident-title {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .incident-type {
    padding: 0.375rem 0.75rem;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .incident-type.traffic_accident {
    background: color-mix(in srgb, #dc2626 10%, transparent);
    color: #dc2626;
  }

  .incident-type.mechanical_failure {
    background: color-mix(in srgb, #2563eb 10%, transparent);
    color: #2563eb;
  }

  .incident-type.weather_delay {
    background: color-mix(in srgb, #9333ea 10%, transparent);
    color: #9333ea;
  }

  .incident-type.cargo_issue {
    background: color-mix(in srgb, #16a34a 10%, transparent);
    color: #16a34a;
  }

  .incident-type.other {
    background: color-mix(in srgb, #71717a 10%, transparent);
    color: #71717a;
  }

  .incident-date {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .incident-damage {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .incident-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .detail-group {
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

  .incident-actions {
    display: flex;
    gap: 1rem;
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

  /* Include all the controls, pagination, and responsive styles */
  .controls {
    padding: 1.5rem 1.5rem 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1.5rem;
  }

  .search-box {
    flex: 1;
    min-width: 300px;
    position: relative;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 0.95rem;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--theme-color);
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
  }

  .filter-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .filter-select {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 0.95rem;
    min-width: 200px;
  }

  .sort-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .sort-button {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-secondary);
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .sort-button:hover {
    border-color: var(--theme-color);
    color: var(--theme-color);
  }

  .sort-button.active {
    background: color-mix(in srgb, var(--theme-color) 10%, var(--bg-secondary));
    border-color: var(--theme-color);
    color: var(--theme-color);
  }

  .results-summary {
    padding: 1rem 1.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
    border-bottom: 1px solid var(--border-color);
  }

  .pagination {
    padding: 1.5rem;
    display: flex;
    justify-content: center;
  }

  .pagination-controls {
    display: flex;
    gap: 0.5rem;
  }

  .page-button {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .page-button:hover {
    border-color: var(--theme-color);
    color: var(--theme-color);
  }

  .page-button.active {
    background: color-mix(in srgb, var(--theme-color) 10%, var(--bg-secondary));
    border-color: var(--theme-color);
    color: var(--theme-color);
  }

  .page-ellipsis {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .incidents {
      padding: 1rem;
    }

    .incidents-title {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .incident-item {
      padding: 1rem;
    }

    .incident-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .incident-details {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .incident-actions {
      flex-direction: column;
    }

    .action-button {
      width: 100%;
      text-align: center;
    }

    .controls {
      padding: 1rem 1rem 0;
      flex-direction: column;
    }

    .search-box {
      min-width: 100%;
    }

    .filter-group {
      flex-direction: column;
    }

    .sort-buttons {
      flex-wrap: wrap;
    }

    .sort-button {
      flex: 1;
      min-width: calc(50% - 0.25rem);
      text-align: center;
    }

    .results-summary {
      padding: 1rem;
    }

    .type-stats {
      gap: 0.5rem;
    }

    .type-stat {
      padding: 0.625rem 0.875rem;
    }

    .type-label {
      font-size: 0.9rem;
    }

    .type-value {
      font-size: 1.125rem;
    }
  }
</style> 
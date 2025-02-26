<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import { formatLargeNumber, formatCurrency, formatDate } from '$lib/utils/format';
  
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

<svelte:head>
  <title>Incident Reports | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    <h1 class="page-title">Incident Reports</h1>

    <div class="stats-grid">
      <Card title="Total Incidents" icon={icons.chart}>
        <div class="stat-content">
          <p class="stat-number">{stats.total}</p>
          <p class="stat-label">Reported incidents</p>
        </div>
      </Card>

      <Card title="Total Damage Cost" icon={icons.chart}>
        <div class="stat-content">
          <p class="stat-number">{stats.totalDamage}</p>
          <p class="stat-label">Estimated damage</p>
        </div>
      </Card>
    </div>

    <Card title="Incident Log" icon={icons.incidents}>
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
            class="filter-select"
            bind:value={selectedType}
          >
            {#each incidentTypes as type}
              <option value={type}>{type.replace(/_/g, ' ')}</option>
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
          </div>
        </div>
      </div>

      <div class="results-summary">
        Showing {paginatedRecords.length} of {filteredRecords.length} incidents
      </div>

      <div class="records-list">
        {#each paginatedRecords as incident}
          <div class="record-item">
            <div class="record-header">
              <div class="record-title">
                <h3 class="themed-text">Incident #{incident.id}</h3>
                <span class="incident-date">{formatDate(incident.date)}</span>
              </div>
              <span class="status-chip {incident.type.toLowerCase()}">{incident.type.replace(/_/g, ' ')}</span>
            </div>
            <div class="incident-details">
              <div class="detail-group">
                <span class="detail-label">Driver</span>
                <span class="detail-value">{incident.driver.first_name} {incident.driver.last_name}</span>
              </div>
              <div class="detail-group">
                <span class="detail-label">Location</span>
                <span class="detail-value">{incident.location}</span>
              </div>
              <div class="detail-group">
                <span class="detail-label">Damage Estimate</span>
                <span class="detail-value themed-text">{formatCurrency(incident.damage_estimate)}</span>
              </div>
            </div>
            <p class="incident-description">{incident.description}</p>
          </div>
        {/each}
      </div>

      <div class="pagination">
        <div class="pagination-controls">
          <button 
            class="page-button" 
            disabled={currentPage === 1}
            on:click={() => goToPage(1)}
          >
            First
          </button>
          <button 
            class="page-button" 
            disabled={currentPage === 1}
            on:click={() => goToPage(currentPage - 1)}
          >
            Previous
          </button>
          
          {#each Array(totalPages) as _, i}
            <button 
              class="page-button" 
              class:active={currentPage === i + 1}
              on:click={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          {/each}
          
          <button 
            class="page-button" 
            disabled={currentPage === totalPages}
            on:click={() => goToPage(currentPage + 1)}
          >
            Next
          </button>
          <button 
            class="page-button" 
            disabled={currentPage === totalPages}
            on:click={() => goToPage(totalPages)}
          >
            Last
          </button>
        </div>
      </div>
    </Card>
  </div>
</Layout>

<style>
  .incident-date {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }

  .status-chip {
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--radius-md);
    font-size: var(--font-size-xs);
    font-weight: 600;
    text-transform: uppercase;
  }

  .status-chip.traffic_accident {
    background: #fee2e2;
    color: #dc2626;
  }

  .status-chip.mechanical_failure {
    background: #fef3c7;
    color: #d97706;
  }

  .status-chip.weather_delay {
    background: #e0e7ff;
    color: #4f46e5;
  }

  .status-chip.cargo_issue {
    background: #f3e8ff;
    color: #7c3aed;
  }

  .status-chip.other {
    background: #f3f4f6;
    color: #4b5563;
  }

  .incident-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }

  .detail-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .detail-label {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }

  .detail-value {
    font-size: var(--font-size-md);
    font-weight: 500;
  }

  .incident-description {
    color: var(--text-secondary);
    font-size: var(--font-size-md);
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .incident-details {
      grid-template-columns: 1fr;
    }
  }
  
</style> 
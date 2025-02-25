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
          <p class="stat-number themed-text">{stats.total}</p>
          <p class="stat-label">Reported incidents</p>
        </div>
      </Card>

      <Card title="Total Damage Cost" icon={icons.chart}>
        <div class="stat-content">
          <p class="stat-number themed-text">{stats.totalDamage}</p>
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

      <div class="incidents-list">
        {#each paginatedRecords as incident}
          <div class="incident-item">
            <div class="incident-header">
              <div class="incident-title">
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
  .page {
    padding: var(--spacing-xl);
    max-width: 1400px;
    margin: 0 auto;
  }

  .stat-content {
    padding: var(--spacing-lg);
    min-height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .stat-number {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    margin-bottom: var(--spacing-xs);
  }

  .stat-label {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }

  .incidents-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
  }

  .incident-item {
    padding: var(--spacing-lg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    background: var(--bg-secondary);
  }

  .incident-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
  }

  .incident-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .incident-title h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
  }

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
    .page {
      padding: var(--spacing-md);
    }

    .incident-item {
      padding: var(--spacing-md);
    }

    .incident-header {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-sm);
    }

    .incident-details {
      grid-template-columns: 1fr;
    }
  }
</style> 
<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import ListControls from '$lib/components/ListControls.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import { icons } from '$lib/icons';
  import { formatLargeNumber, formatCurrency, formatDate } from '$lib/utils/format';
  import type { IncidentReport } from '$lib/api/incidents';
  import { getIncidents } from '$lib/api/incidents';
  import Chip from '$lib/components/Chip.svelte';
  
  let isNavExpanded = true;

  export let data;
  let incidents: IncidentReport[] = data.incidents || [];
  let error = data.error;

  // Make stats calculation reactive based on incidents data
  $: stats = incidents ? {
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
  } : {
    total: 0,
    totalDamage: formatLargeNumber(0),
    byType: {
      accidents: 0,
      mechanical: 0,
      weather: 0,
      cargo: 0,
      other: 0
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

  function handleSort(field: string) {
    if (field === 'date' || field === 'type' || field === 'damage_estimate') {
      if (sortField === field) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        sortField = field;
        sortDirection = 'desc';
      }
    }
  }

  function formatIncidentTypeLabel(type: string): string {
    if (type === 'ALL') return 'All Types';
    return type.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Add this reactive statement to update sort buttons when sort state changes
  $: sortButtons = [
    {
      field: 'date',
      label: 'Date',
      active: sortField === 'date',
      direction: sortField === 'date' ? sortDirection : undefined
    },
    {
      field: 'damage_estimate',
      label: 'Damage',
      active: sortField === 'damage_estimate',
      direction: sortField === 'damage_estimate' ? sortDirection : undefined
    }
  ];
</script>

<svelte:head>
  <title>Incident Reports | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    <h1 class="page-title">Incident Reports</h1>
    
    {#if error}
      <ErrorMessage message={error} />
    {:else}
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
        <ListControls
          searchPlaceholder="Search incidents..."
          bind:searchQuery
          bind:selectedFilter={selectedType}
          filterOptions={incidentTypes}
          formatFilterLabel={formatIncidentTypeLabel}
          {sortButtons}
          addNewHref="/incidents/new"
          addNewLabel="Report Incident"
          onSearch={(value) => searchQuery = value}
          onFilterChange={(value) => selectedType = value}
          onSort={handleSort}
        />

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
              <div class="record-details">
                <div class="detail">
                  <span class="label">Driver</span>
                  <span class="value">{incident.driver.first_name} {incident.driver.last_name}</span>
                </div>
                <div class="detail">
                  <span class="label">Location</span>
                  <span class="value">{incident.location}</span>
                </div>
                <div class="detail">
                  <span class="label">Damage Estimate</span>
                  <span class="value themed-text">{formatCurrency(incident.damage_estimate)}</span>
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
    {/if}
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

  .incident-description {
    color: var(--text-secondary);
    font-size: var(--font-size-md);
    line-height: 1.5;
  }
</style> 
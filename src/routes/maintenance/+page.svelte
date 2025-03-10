<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import ListControls from '$lib/components/ListControls.svelte';
  import { icons } from '$lib/icons';
  import { formatLargeNumber, formatCurrency, formatDate } from '$lib/utils/format';
  import type { MaintenanceLog } from '$lib/api/maintenance';
  import { getMaintenanceLogs } from '$lib/api/maintenance';
  
  let isNavExpanded = true;

  // Get the data from the load function
  export let data;
  let maintenanceLogs = data.maintenanceLogs;

  // Make stats calculation reactive based on maintenance data
  $: stats = {
    routine: maintenanceLogs.filter(r => r.service_type === 'ROUTINE_MAINTENANCE').length,
    repair: maintenanceLogs.filter(r => r.service_type === 'REPAIR').length,
    emergency: maintenanceLogs.filter(r => r.service_type === 'EMERGENCY').length,
    totalCost: formatLargeNumber(
      maintenanceLogs.reduce((sum, record) => sum + record.cost, 0)
    )
  };

  // Pagination settings
  let currentPage = 1;
  const recordsPerPage = 5;

  // Search and filter state
  let searchQuery = '';
  let selectedServiceType: string = 'ALL';
  let sortField: 'date' | 'cost' | 'truck_number' = 'date';
  let sortDirection: 'asc' | 'desc' = 'desc';

  // Service type options
  const serviceTypes = ['ALL', 'ROUTINE_MAINTENANCE', 'REPAIR', 'EMERGENCY'];

  function formatServiceTypeLabel(type: string): string {
    if (type === 'ALL') return 'All Types';
    return type.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Filtered and sorted records
  $: filteredRecords = maintenanceLogs
    .filter(record => {
      const matchesSearch = searchQuery === '' || 
        record.truck.truck_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.truck.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.truck.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.mechanic.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedServiceType === 'ALL' || 
        record.service_type === selectedServiceType;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
          break;
        case 'cost':
          comparison = b.cost - a.cost;
          break;
        case 'truck_number':
          comparison = a.truck.truck_number.localeCompare(b.truck.truck_number);
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
  $: if (searchQuery || selectedServiceType) {
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

  // Add this reactive statement to update sort buttons when sort state changes
  $: sortButtons = [
    {
      field: 'date',
      label: 'Date',
      active: sortField === 'date',
      direction: sortField === 'date' ? sortDirection : undefined
    },
    {
      field: 'cost',
      label: 'Cost',
      active: sortField === 'cost',
      direction: sortField === 'cost' ? sortDirection : undefined
    },
    {
      field: 'truck_number',
      label: 'Truck #',
      active: sortField === 'truck_number',
      direction: sortField === 'truck_number' ? sortDirection : undefined
    }
  ];
</script>

<svelte:head>
  <title>Maintenance Management | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    <h1 class="page-title">Maintenance Management</h1>
    
    <div class="stats-grid">
      <Card title="Routine Maintenance" icon={icons.maintenance}>
        <div class="stat-content">
          <p class="stat-number">{stats.routine}</p>
          <p class="stat-label">Services</p>
        </div>
      </Card>

      <Card title="Repairs" icon={icons.maintenance}>
        <div class="stat-content">
          <p class="stat-number">{stats.repair}</p>
          <p class="stat-label">Active repairs</p>
        </div>
      </Card>

      <Card title="Emergency Services" icon={icons.maintenance}>
        <div class="stat-content warning">
          <p class="stat-number">{stats.emergency}</p>
          <p class="stat-label">Critical issues</p>
        </div>
      </Card>
    </div>

    <Card title="Maintenance Records" icon={icons.maintenance}>
      <ListControls
        searchPlaceholder="Search records..."
        bind:searchQuery
        bind:selectedFilter={selectedServiceType}
        filterOptions={serviceTypes}
        formatFilterLabel={formatServiceTypeLabel}
        {sortButtons}
        addNewHref="/maintenance/new"
        addNewLabel="Add Maintenance Log"
        onSearch={(value) => searchQuery = value}
        onFilterChange={(value) => selectedServiceType = value}
        onSort={handleSort}
      />

      <div class="results-summary">
        Showing {filteredRecords.length} of {maintenanceLogs.length} records
      </div>

      <div class="record-list">
        {#each paginatedRecords as record}
          <div class="record-item">
            <div class="record-header">
              <div class="record-title">
                <h3>{record.truck.make} {record.truck.model} ({record.truck.truck_number})</h3>
                <span class="chip {record.service_type.toLowerCase()}">{record.service_type.replace('_', ' ')}</span>
              </div>
              <div class="cost">
                {formatCurrency(record.cost)}
              </div>
            </div>

            <div class="record-details">
              <div class="detail">
                <span class="label">Date:</span>
                <span class="value">{formatDate(record.date)}</span>
              </div>
              <div class="detail">
                <span class="label">Mechanic:</span>
                <span class="value">{record.mechanic}</span>
              </div>
              <div class="detail">
                <span class="label">Mileage:</span>
                <span class="value">{record.truck.mileage.toLocaleString()} miles</span>
              </div>
              <div class="detail">
                <span class="label">Location:</span>
                <span class="value">{record.location}</span>
              </div>
            </div>

            <p class="description">{record.notes}</p>

            <div class="record-actions">
              <a href="/maintenance/{record.id}" class="action-button">View Full Details</a>
              <button class="action-button">Update Record</button>
            </div>
          </div>
        {/each}
      </div>

      <div class="pagination">
        <div class="pagination-info">
          Showing {(currentPage - 1) * recordsPerPage + 1} to {Math.min(currentPage * recordsPerPage, filteredRecords.length)} of {filteredRecords.length} records
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
  .chip {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .chip.routine_maintenance {
    background: #dbeafe;
    color: #2563eb;
  }

  .chip.repair {
    background: #fef3c7;
    color: #d97706;
  }

  .chip.emergency {
    background: #fee2e2;
    color: #dc2626;
  }

  .item-priority {
    font-size: 0.875rem;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 8px;
  }

  .item-priority.high {
    background: #fee2e2;
    color: #dc2626;
  }

  .item-priority.medium {
    background: #fef3c7;
    color: #d97706;
  }

  .item-priority.critical {
    background: #fecaca;
    color: #b91c1c;
  }

  .description {
    color: var(--text-secondary);
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }

  .cost {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--theme-color);
  }

  @media (max-width: 768px) {
    .maintenance-item {
      padding: 1rem;
    }

    .stat-content {
      padding: 0.875rem 1rem;
      min-height: 100px;
    }

    .stat-number {
      font-size: 1.875rem;
    }

    .stat-label {
      font-size: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    .stat-number {
      font-size: 1.625rem;
    }
  }
</style> 
<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import ListControls from '$lib/components/ListControls.svelte';
  
  let isNavExpanded = true;

  interface LicensePlate {
    number: string;
    state: string;
  }

  interface Truck {
    id: string;
    truck_number: string;
    vin: string;
    make: string;
    model: string;
    year: number;
    license_plate: LicensePlate;
    mileage: number;
    status: 'IN_TRANSIT' | 'MAINTENANCE' | 'AVAILABLE';
    trailer_type: 'DRY_VAN' | 'REFRIGERATED' | 'FLATBED';
    capacity_tons: number;
    fuel_type: string;
    last_maintenance: string;
    created_at: string;
    updated_at: string;
  }

  // Generate sample trucks
  const trucks: Truck[] = Array.from({ length: 15 }, (_, i): Truck => ({
    id: `truck_${i + 1}`,
    truck_number: `${String.fromCharCode(65 + (i % 8))}${String(200000 + i).padStart(6, '0')}`,
    vin: `VIN${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    make: ['Freightliner', 'Peterbilt', 'Kenworth', 'Volvo', 'Mack'][i % 5],
    model: ['Cascadia', '579', 'T680', 'VNL', 'Anthem'][i % 5],
    year: 2018 + (i % 6),
    license_plate: {
      number: `TR${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      state: ['NY', 'CA', 'TX', 'FL', 'IL'][i % 5]
    },
    mileage: 50000 + (i * 10000),
    status: ['IN_TRANSIT', 'MAINTENANCE', 'AVAILABLE'][i % 3],
    trailer_type: ['DRY_VAN', 'REFRIGERATED', 'FLATBED'][i % 3],
    capacity_tons: 20 + (i % 15),
    fuel_type: 'DIESEL',
    last_maintenance: new Date(Date.now() - (i * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    created_at: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    updated_at: new Date(Date.now() - (i * 12 * 60 * 60 * 1000)).toISOString()
  }));

  // Stats calculation
  const stats = {
    totalTrucks: trucks.length,
    activeFleet: trucks.filter(t => t.status === 'IN_TRANSIT' || t.status === 'AVAILABLE').length,
    fleetUtilization: Math.round(
      (trucks.filter(t => t.status === 'IN_TRANSIT').length / trucks.length) * 100
    )
  };

  // Pagination settings
  let currentPage = 1;
  const recordsPerPage = 5;

  // Search and filter state
  let searchQuery = '';
  let selectedStatus: string = 'ALL';
  let sortField: 'truck_number' | 'mileage' | 'last_maintenance' = 'truck_number';
  let sortDirection: 'asc' | 'desc' = 'asc';

  // Status options
  const statusTypes = ['ALL', 'IN_TRANSIT', 'MAINTENANCE', 'AVAILABLE'];

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
  }

  function formatStatusLabel(status: string): string {
    if (status === 'ALL') return 'All Statuses';
    return status.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Filtered and sorted records
  $: filteredRecords = trucks
    .filter(truck => {
      const matchesSearch = searchQuery === '' || 
        truck.truck_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        truck.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${truck.make} ${truck.model}`.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === 'ALL' || truck.status === selectedStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'truck_number':
          comparison = a.truck_number.localeCompare(b.truck_number);
          break;
        case 'mileage':
          comparison = a.mileage - b.mileage;
          break;
        case 'last_maintenance':
          comparison = new Date(a.last_maintenance).getTime() - new Date(b.last_maintenance).getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
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

  // Add this reactive statement to update sort buttons when sort state changes
  $: sortButtons = [
    {
      field: 'truck_number',
      label: 'Number',
      active: sortField === 'truck_number',
      direction: sortField === 'truck_number' ? sortDirection : undefined
    },
    {
      field: 'mileage',
      label: 'Mileage',
      active: sortField === 'mileage',
      direction: sortField === 'mileage' ? sortDirection : undefined
    },
    {
      field: 'last_maintenance',
      label: 'Maintenance',
      active: sortField === 'last_maintenance',
      direction: sortField === 'last_maintenance' ? sortDirection : undefined
    }
  ];
</script>

<svelte:head>
  <title>Fleet Management | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    <h1 class="page-title">Fleet Management</h1>
    <div class="stats-grid">
      <Card title="Total Fleet" icon={icons.truck}>
        <div class="stat-content">
          <p class="stat-number">{stats.totalTrucks}</p>
          <p class="stat-label">Registered Trucks</p>
        </div>
      </Card>

      <Card title="Active Fleet" icon={icons.truck}>
        <div class="stat-content">
          <p class="stat-number">{stats.activeFleet}</p>
          <p class="stat-label">Available & In Transit</p>
        </div>
      </Card>

      <Card title="Fleet Utilization" icon={icons.chart}>
        <div class="stat-content">
          <p class="stat-number">{stats.fleetUtilization}<span class="percent">%</span></p>
          <p class="stat-label">Currently In Transit</p>
        </div>
      </Card>
    </div>

    <Card title="Truck Records" icon={icons.truck}>
      <ListControls
        searchPlaceholder="Search trucks..."
        bind:searchQuery
        bind:selectedFilter={selectedStatus}
        filterOptions={statusTypes}
        formatFilterLabel={formatStatusLabel}
        {sortButtons}
        addNewHref="/trucks/new"
        addNewLabel="Add New Truck"
        onSearch={(value) => searchQuery = value}
        onFilterChange={(value) => selectedStatus = value}
        onSort={handleSort}
      />

      <div class="results-summary">
        Showing {paginatedRecords.length} of {filteredRecords.length} trucks
      </div>

      <div class="records-list">
        {#each paginatedRecords as truck}
          <div class="record-item">
            <div class="record-header">
              <div class="record-title">
                <h3>{truck.make} {truck.model}</h3>
                <span class="truck-number">{truck.truck_number}</span>
              </div>
              <span class="status-badge {truck.status.toLowerCase()}">
                {truck.status.replace('_', ' ')}
              </span>
            </div>

            <div class="record-details">
              <div class="detail">
                <span class="label">Vehicle Info</span>
                <span class="value">{truck.year} • VIN: {truck.vin}</span>
                <span class="sub-value">License: {truck.license_plate.number} ({truck.license_plate.state})</span>
              </div>

              <div class="detail">
                <span class="label">Usage</span>
                <span class="value">{formatNumber(truck.mileage)} miles</span>
                <span class="sub-value">Last Maintenance: {formatDate(truck.last_maintenance)}</span>
              </div>

              <div class="detail">
                <span class="label">Specifications</span>
                <span class="value">{truck.trailer_type.replace('_', ' ')}</span>
                <span class="sub-value">Capacity: {truck.capacity_tons} tons • {truck.fuel_type}</span>
              </div>
            </div>

            <div class="record-actions">
              <a href="/trucks/{truck.id}" class="action-button">View Details</a>
              <button class="action-button">Schedule Maintenance</button>
              <button class="action-button">Update Status</button>
            </div>
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
            {#if i + 1 === currentPage || i + 1 === 1 || i + 1 === totalPages || (i + 1 >= currentPage - 1 && i + 1 <= currentPage + 1)}
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

  .percent {
    font-size: 1.5rem;
    opacity: 0.7;
    vertical-align: super;
    margin-left: 0.25rem;
  }

  .truck-number {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .status-badge.in_transit {
    background: #dbeafe;
    color: #1d4ed8;
  }

  .status-badge.maintenance {
    background: #fee2e2;
    color: #dc2626;
  }

  .status-badge.available {
    background: #dcfce7;
    color: #15803d;
  }

  :global(.action-button.primary) {
    padding: var(--spacing-md) var(--spacing-xl);
    background: var(--theme-color);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition-all);
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    text-align: center;
  }

  @media (min-width: 768px) {
    :global(.action-button.primary) {
      width: auto;
      display: inline-flex;
    }
  }

  :global(.action-button.primary:hover) {
    opacity: 0.9;
  }
</style> 
<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import ListControls from '$lib/components/ListControls.svelte';
  import type { Truck } from '$lib/api/trucks';
  import { 
    setTruckAvailable,
    setTruckInTransit,
    setTruckInMaintenance,
    retireTruck,
    type TruckStatus,
    getAvailableStatusTransitions
  } from '$lib/api/trucks';
  import LoadErrorMessage from '$lib/components/LoadErrorMessage.svelte';

  export let data;
  let trucks: Truck[] = data.trucks || [];
  let error = data.error;

  let isNavExpanded = true;

  // Stats calculation - make reactive based on trucks data
  $: stats = {
    totalTrucks: trucks.length,
    activeFleet: trucks.filter(t => t.status === 'IN_TRANSIT' || t.status === 'AVAILABLE').length,
    fleetUtilization: trucks.length ? Math.round(
      (trucks.filter(t => t.status === 'IN_TRANSIT').length / trucks.length) * 100
    ) : 0
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

  // Add these new interfaces
  interface UpdateStatusModal {
    isOpen: boolean;
    truckId: string | null;
    currentStatus: TruckStatus | null;
    selectedStatus: TruckStatus | null;
  }

  // Add this state
  let updateStatusModal: UpdateStatusModal = {
    isOpen: false,
    truckId: null,
    currentStatus: null,
    selectedStatus: null
  };

  let updateStatusError: string | null = null;

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

  function handleSort(field: string) {
    if (field === 'truck_number' || field === 'mileage' || field === 'last_maintenance') {
      if (sortField === field) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        sortField = field;
        sortDirection = 'desc';
      }
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

  function openUpdateStatus(truck: Truck) {
    if (truck.status === 'RETIRED') {
      console.error('Cannot update retired truck');
      return;
    }
    
    updateStatusModal = {
      isOpen: true,
      truckId: truck.id,
      currentStatus: truck.status,
      selectedStatus: null
    };
    updateStatusError = null;
  }

  function closeUpdateStatus() {
    updateStatusModal = {
      isOpen: false,
      truckId: null,
      currentStatus: null,
      selectedStatus: null
    };
    updateStatusError = null;
  }

  async function handleUpdateStatus() {
    if (!updateStatusModal.truckId || !updateStatusModal.selectedStatus) return;

    try {
      updateStatusError = null;
      let updatedTruck: Truck;

      switch (updateStatusModal.selectedStatus) {
        case 'AVAILABLE':
          updatedTruck = await setTruckAvailable(updateStatusModal.truckId);
          break;
        case 'IN_TRANSIT':
          updatedTruck = await setTruckInTransit(updateStatusModal.truckId);
          break;
        case 'UNDER_MAINTENANCE':
          updatedTruck = await setTruckInMaintenance(updateStatusModal.truckId);
          break;
        case 'RETIRED':
          updatedTruck = await retireTruck(updateStatusModal.truckId);
          break;
        default:
          throw new Error('Invalid status selected');
      }

      // Update the trucks array with the updated truck
      trucks = trucks.map(truck => 
        truck.id === updatedTruck.id ? updatedTruck : truck
      );

      closeUpdateStatus();
    } catch (error) {
      console.error('Failed to update status:', error);
      updateStatusError = 'Failed to update truck status. Please try again.';
    }
  }
</script>

<svelte:head>
  <title>Fleet Management | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    <h1 class="page-title">Trucks</h1>
    
    {#if error}
      <LoadErrorMessage message={error} />
    {:else}
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
                {#if truck.status !== 'RETIRED'}
                  <button class="action-button" on:click={() => openUpdateStatus(truck)}>
                    Update Status
                  </button>
                {/if}
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
    {/if}
  </div>

  <!-- Keep the modal outside the error condition -->
  {#if updateStatusModal.isOpen}
    <div class="modal-backdrop" on:click={closeUpdateStatus}>
      <div class="modal-content" on:click|stopPropagation>
        <div class="modal-header">
          <h3>Update Truck Status</h3>
          <button class="modal-close" on:click={closeUpdateStatus}>×</button>
        </div>
        <div class="modal-body">
          {#if updateStatusError}
            <div class="error-message">
              {updateStatusError}
            </div>
          {/if}

          <div class="form-group">
            <label for="status-action">New Status</label>
            <select 
              id="status-action"
              bind:value={updateStatusModal.selectedStatus}
              class="form-select"
            >
              <option value="">Select a new status...</option>
              {#each getAvailableStatusTransitions(updateStatusModal.currentStatus ?? 'AVAILABLE') as status}
                <option value={status.value}>{status.label}</option>
              {/each}
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="action-button" on:click={closeUpdateStatus}>Cancel</button>
          <button 
            class="action-button primary"
            on:click={handleUpdateStatus}
            disabled={!updateStatusModal.selectedStatus}
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  {/if}
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

  /* Add these modal styles */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    width: 90%;
    max-width: 500px;
    box-shadow: var(--shadow-lg);
  }

  .modal-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-header h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  .modal-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
  }

  .modal-close:hover {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }

  .modal-body {
    padding: var(--spacing-lg);
  }

  .modal-footer {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-md);
  }

  .error-message {
    text-align: center;
    padding: 2rem;
  }

  .error-message p {
    color: var(--error-color, #dc2626);
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .form-group {
    margin-bottom: var(--spacing-lg);
  }

  .form-group label {
    display: block;
    margin-bottom: var(--spacing-sm);
    color: var(--text-primary);
    font-weight: 500;
  }

  .form-select {
    width: 100%;
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: var(--font-size-md);
  }

  .form-select:focus {
    outline: none;
    border-color: var(--theme-color);
  }
</style> 
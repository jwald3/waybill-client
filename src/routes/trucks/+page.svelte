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
  import TruckStatusModal from '$lib/components/TruckStatusModal.svelte';
  import TruckCard from '$lib/components/TruckCard.svelte';
  import type { PageData } from './$types';
  import Pagination from '$lib/components/Pagination.svelte';
  import HomepageSummaryCard from '$lib/components/HomepageSummaryCard.svelte';

  export let data: PageData;

  let isNavExpanded = true;

  let trucks: Truck[] = data.trucks || [];
  let error = data.error;
  
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

  let isUpdateStatusModalOpen = false;
  let currentTruckId: string | null = null;
  let currentTruckStatus: TruckStatus | null = null;

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
    
    currentTruckId = truck.id;
    currentTruckStatus = truck.status;
    isUpdateStatusModalOpen = true;
  }

  function closeUpdateStatus() {
    currentTruckId = null;
    currentTruckStatus = null;
    isUpdateStatusModalOpen = false;
  }

  async function handleUpdateStatus(newStatus: TruckStatus) {
    if (!currentTruckId) return;

    try {
      let updatedTruck: Truck;

      switch (newStatus) {
        case 'AVAILABLE':
          updatedTruck = await setTruckAvailable(currentTruckId);
          break;
        case 'IN_TRANSIT':
          updatedTruck = await setTruckInTransit(currentTruckId);
          break;
        case 'UNDER_MAINTENANCE':
          updatedTruck = await setTruckInMaintenance(currentTruckId);
          break;
        case 'RETIRED':
          updatedTruck = await retireTruck(currentTruckId);
          break;
        default:
          throw new Error('Invalid status selected');
      }

      trucks = trucks.map(truck => 
        truck.id === updatedTruck.id ? updatedTruck : truck
      );

      closeUpdateStatus();
    } catch (error) {
      console.error('Failed to update status:', error);
      throw error;
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
			<LoadErrorMessage
				message={error}
				icon={icons.truck}
				title="Unable to Load Trucks"
			/>
		{:else}
			<div class="stats-grid">
				<HomepageSummaryCard
          icon={icons.totalFleet}
          title="Total Fleet"
          value={stats.totalTrucks}
          subtitle="Registered Trucks"
        />
        <HomepageSummaryCard
          icon={icons.activeFleet}
          title="Active Fleet"
          value={stats.activeFleet}
          subtitle="Available & In Transit"
        />
        <HomepageSummaryCard
          icon={icons.utilization}
          title="Fleet Utilization"
          value={stats.fleetUtilization}
          subtitle="Currently In Transit"
        />
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
            <TruckCard 
              {truck} 
              onUpdateStatus={openUpdateStatus}
            />
          {/each}
        </div>

        <Pagination
          {currentPage}
          {totalPages}
          totalItems={filteredRecords.length}
          itemsPerPage={recordsPerPage}
          onPageChange={goToPage}
        />
      </Card>
    {/if}
  </div>

  <TruckStatusModal
    isOpen={isUpdateStatusModalOpen}
    onClose={closeUpdateStatus}
    onSubmit={handleUpdateStatus}
    availableStatuses={currentTruckStatus ? getAvailableStatusTransitions(currentTruckStatus) : []}
  />
</Layout>

<style>
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
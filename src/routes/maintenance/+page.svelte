<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import ListControls from '$lib/components/ListControls.svelte';
  import { icons } from '$lib/icons';
  import { formatLargeNumber } from '$lib/utils/format';
  import LoadErrorMessage from '$lib/components/LoadErrorMessage.svelte';
  import MaintenanceCard from '$lib/components/MaintenanceCard.svelte';
  import type { PageData } from './$types';
  import Pagination from '$lib/components/Pagination.svelte';
  import HomepageSummaryCard from '$lib/components/HomepageSummaryCard.svelte';
  import { MAINTENANCE_SERVICE_TYPES, type MaintenanceServiceType } from '$lib/types/maintenance';

  export let data: PageData;

  let isNavExpanded = true;

  let maintenanceLogs = data.maintenanceLogs;
  let error = data.error;

  // Make stats calculation reactive based on maintenance data
  $: stats = maintenanceLogs ? {
    routine: maintenanceLogs.filter(r => r.service_type === 'ROUTINE_MAINTENANCE').length,
    repair: maintenanceLogs.filter(r => r.service_type === 'EMERGENCY_REPAIR').length,
    totalCost: formatLargeNumber(
      maintenanceLogs.reduce((sum, record) => sum + record.cost, 0)
    )
  } : {
    routine: 0,
    repair: 0,
    totalCost: formatLargeNumber(0)
  };

  // Pagination settings
  let currentPage = 1;
  const recordsPerPage = 5;

  // Search and filter state
  let searchQuery = '';
  let selectedServiceType: 'ALL' | MaintenanceServiceType = 'ALL';
  let sortField: 'date' | 'cost' | 'truck_number' = 'date';
  let sortDirection: 'asc' | 'desc' = 'desc';

  // Service type options
  const serviceTypes = ['ALL', ...MAINTENANCE_SERVICE_TYPES];

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

  function handleSort(field: string) {
    if (sortField === field as typeof sortField) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field as typeof sortField;
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
    
    {#if error}
			<LoadErrorMessage
				message={error}
				icon={icons.maintenance}
				title="Unable to Load Maintenance Records"
			/>
		{:else}
			<div class="stats-grid">
				<HomepageSummaryCard
          icon={icons.calendar}
          title="Routine Maintenance"
          value={stats.routine}
          subtitle="Services"
        />
        <HomepageSummaryCard
          icon={icons.maintenance}
          title="Emergency Repairs"
          value={stats.repair}
          subtitle="Critical issues"
        />
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
          onFilterChange={(value) => selectedServiceType = value as 'ALL' | MaintenanceServiceType}
          onSort={handleSort}
        />

        <div class="results-summary">
          Showing {filteredRecords.length} of {maintenanceLogs.length} records
        </div>

        <div class="records-list">
          {#if paginatedRecords.length === 0}
            <div class="no-records">
              {#if searchQuery || selectedServiceType !== 'ALL'}
                <p>No maintenance records match your search criteria</p>
                <button class="clear-filters" on:click={() => {
                  searchQuery = '';
                  selectedServiceType = 'ALL';
                }}>Clear filters</button>
              {:else}
                <p>No maintenance records have been added yet</p>
                <a href="/maintenance/new" class="add-record-link">Add your first maintenance record</a>
              {/if}
            </div>
          {:else}
            {#each paginatedRecords as record}
              <MaintenanceCard {record} />
            {/each}
          {/if}
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
</Layout>

<style>
  .no-records {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;
    background: var(--surface-2);
    border-radius: 0.5rem;
    margin: 1rem 0;
  }

  .no-records p {
    color: var(--text-2);
    margin-bottom: 1rem;
  }

  .clear-filters {
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .clear-filters:hover {
    background: var(--primary-dark);
  }

  .add-record-link {
    color: var(--primary);
    text-decoration: none;
    font-weight: 500;
  }

  .add-record-link:hover {
    text-decoration: underline;
  }
</style> 
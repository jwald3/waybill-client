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

  export let data: PageData;

  let isNavExpanded = true;

  let maintenanceLogs = data.maintenanceLogs;
  let error = data.error;

  // Make stats calculation reactive based on maintenance data
  $: stats = maintenanceLogs ? {
    routine: maintenanceLogs.filter(r => r.service_type === 'ROUTINE_MAINTENANCE').length,
    repair: maintenanceLogs.filter(r => r.service_type === 'REPAIR').length,
    emergency: maintenanceLogs.filter(r => r.service_type === 'EMERGENCY').length,
    totalCost: formatLargeNumber(
      maintenanceLogs.reduce((sum, record) => sum + record.cost, 0)
    )
  } : {
    routine: 0,
    repair: 0,
    emergency: 0,
    totalCost: formatLargeNumber(0)
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
      <LoadErrorMessage message={error} />
    {:else}
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

        <div class="records-list">
          {#each paginatedRecords as record}
            <MaintenanceCard {record} />
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
</Layout>

<style>
  @media (max-width: 768px) {
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
<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import ListControls from '$lib/components/ListControls.svelte';
  import LoadErrorMessage from '$lib/components/LoadErrorMessage.svelte';
  import { icons } from '$lib/icons';
  import type { Driver } from '$lib/api/drivers';
  import DriverStatusModal from '$lib/components/DriverStatusModal.svelte';
  import { 
    activateDriver, 
    suspendDriver, 
    terminateDriver, 
    type EmploymentStatus, 
    getAvailableStatusTransitions 
  } from '$lib/api/drivers';
  import DriverCard from '$lib/components/DriverCard.svelte';

  export let data;
  
  let isNavExpanded = true;

  let drivers: Driver[] = data.drivers;
  let error = data.error;

  // Stats calculation - make reactive based on drivers data
  $: stats = drivers ? {
    active: drivers.filter(d => d.employment_status === 'ACTIVE').length,
    suspended: drivers.filter(d => d.employment_status === 'SUSPENDED').length,
    total: drivers.length
  } : {
    active: 0,
    suspended: 0,
    total: 0
  };

  // Pagination settings
  let currentPage = 1;
  const recordsPerPage = 5;

  // Search and filter state
  let searchQuery = '';
  let selectedStatus: string = 'ALL';
  let sortField: 'last_name' | 'license_expiration' | 'employment_status' = 'last_name';
  let sortDirection: 'asc' | 'desc' = 'asc';

  // Status options
  const statusTypes = ['ALL', 'ACTIVE', 'SUSPENDED', 'TERMINATED'];

  let isUpdateStatusModalOpen = false;
  let currentDriverId: string | null = null;
  let currentDriverStatus: EmploymentStatus | null = null;

  function formatStatusLabel(status: string): string {
    if (status === 'ALL') return 'All Statuses';
    return status.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Filtered and sorted records
  $: filteredRecords = drivers
    .filter(driver => {
      const matchesSearch = searchQuery === '' || 
        `${driver.first_name} ${driver.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.license_number.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === 'ALL' || 
        driver.employment_status === selectedStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'last_name':
          comparison = `${a.last_name} ${a.first_name}`.localeCompare(`${b.last_name} ${b.first_name}`);
          break;
        case 'license_expiration':
          comparison = new Date(a.license_expiration).getTime() - new Date(b.license_expiration).getTime();
          break;
        case 'employment_status':
          comparison = a.employment_status.localeCompare(b.employment_status);
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
    if (field === 'last_name' || field === 'license_expiration' || field === 'employment_status') {
      if (sortField === field) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        sortField = field;
        sortDirection = 'asc';
      }
    }
  }

  // Add this reactive statement to update sort buttons when sort state changes
  $: sortButtons = [
    {
      field: 'last_name',
      label: 'Name',
      active: sortField === 'last_name',
      direction: sortField === 'last_name' ? sortDirection : undefined
    },
    {
      field: 'license_expiration',
      label: 'License Exp.',
      active: sortField === 'license_expiration',
      direction: sortField === 'license_expiration' ? sortDirection : undefined
    },
    {
      field: 'employment_status',
      label: 'Status',
      active: sortField === 'employment_status',
      direction: sortField === 'employment_status' ? sortDirection : undefined
    }
  ];

  function openUpdateStatus(driver: Driver) {
    if (!['ACTIVE', 'SUSPENDED'].includes(driver.employment_status)) {
      console.error('Invalid current status:', driver.employment_status);
      return;
    }
    
    currentDriverId = driver.id;
    currentDriverStatus = driver.employment_status as EmploymentStatus;
    isUpdateStatusModalOpen = true;
  }

  function closeUpdateStatus() {
    currentDriverId = null;
    currentDriverStatus = null;
    isUpdateStatusModalOpen = false;
  }

  async function handleUpdateStatus(newStatus: EmploymentStatus) {
    if (!currentDriverId) return;

    try {
      let updatedDriver: Driver;

      switch (newStatus) {
        case 'ACTIVE':
          updatedDriver = await activateDriver(currentDriverId);
          break;
        case 'SUSPENDED':
          updatedDriver = await suspendDriver(currentDriverId);
          break;
        case 'TERMINATED':
          updatedDriver = await terminateDriver(currentDriverId);
          break;
        default:
          throw new Error('Invalid status selected');
      }

      drivers = drivers.map(driver => 
        driver.id === updatedDriver.id ? updatedDriver : driver
      );
    } catch (error) {
      console.error('Failed to update status:', error);
      throw error;
    }
  }
</script>

<svelte:head>
  <title>Driver Management | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    <h1 class="page-title">Driver Management</h1>
    
    {#if error}
      <LoadErrorMessage message={error} />
    {:else}
      <div class="stats-grid">
        <Card title="Active Drivers" icon={icons.drivers}>
          <div class="stat-content">
            <p class="stat-number">{stats.active}</p>
            <p class="stat-label">Currently Active</p>
          </div>
        </Card>

        <Card title="Suspended" icon={icons.drivers}>
          <div class="stat-content">
            <p class="stat-number">{stats.suspended}</p>
            <p class="stat-label">Temporarily Suspended</p>
          </div>
        </Card>
      </div>

      <Card title="Driver Records" icon={icons.drivers}>
        <ListControls
          searchPlaceholder="Search drivers..."
          bind:searchQuery
          bind:selectedFilter={selectedStatus}
          filterOptions={statusTypes}
          formatFilterLabel={formatStatusLabel}
          {sortButtons}
          addNewHref="/drivers/new"
          addNewLabel="Add New Driver"
          onSearch={(value) => searchQuery = value}
          onFilterChange={(value) => selectedStatus = value}
          onSort={handleSort}
        />

        <div class="results-summary">
          Showing {filteredRecords.length} of {drivers.length} drivers
        </div>

        <div class="records-list">
          {#each paginatedRecords as driver}
            <DriverCard {driver} onUpdateStatus={openUpdateStatus} />
          {/each}
        </div>

        <div class="pagination">
          <div class="pagination-info">
            Showing {(currentPage - 1) * recordsPerPage + 1} to {Math.min(currentPage * recordsPerPage, filteredRecords.length)} of {filteredRecords.length} drivers
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
    {/if}
  </div>

  <DriverStatusModal
    isOpen={isUpdateStatusModalOpen}
    onClose={closeUpdateStatus}
    onSubmit={handleUpdateStatus}
    availableStatuses={currentDriverStatus ? getAvailableStatusTransitions(currentDriverStatus) : []}
  />
</Layout>

<style>
</style> 
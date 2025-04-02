<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import ListControls from '$lib/components/ListControls.svelte';
  import LoadErrorMessage from '$lib/components/LoadErrorMessage.svelte';
  import { icons } from '$lib/icons';
  import type { Facility } from '$lib/api/facilities';
  import FacilityCard from '$lib/components/FacilityCard.svelte';
  
  let isNavExpanded = true;

  export let data;
  let facilities: Facility[] = data.facilities;
  let error = data.error;

  // Make stats calculation reactive based on facilities data
  $: stats = facilities ? {
    totalFacilities: facilities.length,
    totalCapacity: facilities.reduce((sum, f) => sum + f.parking_capacity, 0),
    averageUtilization: Math.round(
      facilities.reduce((sum, _, i) => 
        sum + (75 + (Math.sin(i) * 10) + (Math.random() * 10))
      , 0) / (facilities.length || 1)
    )
  } : {
    totalFacilities: 0,
    totalCapacity: 0,
    averageUtilization: 0
  };

  // Pagination settings
  let currentPage = 1;
  const recordsPerPage = 5;

  // Search and filter state
  let searchQuery = '';
  let selectedType: string = 'ALL';
  let sortField: 'name' | 'parking_capacity' | 'type' = 'name';
  let sortDirection: 'asc' | 'desc' = 'asc';

  // Type options
  const facilityTypes = ['ALL', 'A', 'B', 'C'];

  // Filtered and sorted records
  $: filteredRecords = facilities
    .filter(facility => {
      const matchesSearch = searchQuery === '' || 
        facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facility.facility_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facility.address.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'ALL' || facility.type === selectedType;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'parking_capacity':
          comparison = a.parking_capacity - b.parking_capacity;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
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
  $: if (searchQuery || selectedType) {
    currentPage = 1;
  }

  function handleSort(field: string) {
    if (field === 'name' || field === 'parking_capacity' || field === 'type') {
      if (sortField === field) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        sortField = field;
        sortDirection = 'desc';
      }
    }
  }

  function formatTypeLabel(type: string): string {
    if (type === 'ALL') return 'All Types';
    return `Type ${type}`;
  }

  // Add this reactive statement to update sort buttons when sort state changes
  $: sortButtons = [
    {
      field: 'name',
      label: 'Name',
      active: sortField === 'name',
      direction: sortField === 'name' ? sortDirection : undefined
    },
    {
      field: 'parking_capacity',
      label: 'Capacity',
      active: sortField === 'parking_capacity',
      direction: sortField === 'parking_capacity' ? sortDirection : undefined
    },
    {
      field: 'type',
      label: 'Type',
      active: sortField === 'type',
      direction: sortField === 'type' ? sortDirection : undefined
    }
  ];
</script>

<svelte:head>
  <title>Facility Management | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    <h1 class="page-title">Facility Management</h1>
    
    {#if error}
      <LoadErrorMessage message={error} />
    {:else}
      <div class="stats-grid">
        <Card title="Total Facilities" icon={icons.truck}>
          <div class="stat-content">
            <p class="stat-number">{stats.totalFacilities}</p>
            <p class="stat-label">Active Facilities</p>
          </div>
        </Card>

        <Card title="Total Capacity" icon={icons.truck}>
          <div class="stat-content">
            <p class="stat-number">{stats.totalCapacity.toLocaleString()}</p>
            <p class="stat-label">Parking Spaces</p>
          </div>
        </Card>

        <Card title="Average Utilization" icon={icons.chart}>
          <div class="stat-content">
            <p class="stat-number">{stats.averageUtilization}<span class="percent">%</span></p>
            <p class="stat-label">Facility Space Utilized</p>
          </div>
        </Card>
      </div>

      <Card title="Facility Records" icon={icons.truck}>
        <ListControls
          searchPlaceholder="Search facilities..."
          bind:searchQuery
          bind:selectedFilter={selectedType}
          filterOptions={facilityTypes}
          formatFilterLabel={formatTypeLabel}
          {sortButtons}
          addNewHref="/facilities/new"
          addNewLabel="Add New Facility"
          onSearch={(value) => searchQuery = value}
          onFilterChange={(value) => selectedType = value}
          onSort={handleSort}
        />

        <div class="results-summary">
          Showing {paginatedRecords.length} of {filteredRecords.length} facilities
        </div>

        <div class="records-list">
          {#each paginatedRecords as facility}
            <FacilityCard {facility} />
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
</Layout>

<style>
</style> 
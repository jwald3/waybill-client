<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import ListControls from '$lib/components/ListControls.svelte';
  import ErrorMessage from '$lib/components/ErrorMessage.svelte';
  import { icons } from '$lib/icons';
  import type { Facility } from '$lib/api/facilities';
  
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

  function formatTypeBadge(type: string): string {
    return `TYPE ${type}`;
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
      <ErrorMessage message={error} />
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
            <div class="record-item">
              <div class="record-header">
                <div class="record-title">
                  <h3>{facility.name}</h3>
                  <span class="facility-number">{facility.facility_number}</span>
                </div>
                <span class="type-badge type-{facility.type.toLowerCase()}">
                  {formatTypeBadge(facility.type)}
                </span>
              </div>

              <div class="record-details">
                <div class="detail">
                  <span class="label">Address</span>
                  <span class="value">{facility.address.street}</span>
                  <span class="sub-value">{facility.address.city}, {facility.address.state} {facility.address.zip}</span>
                </div>

                <div class="detail">
                  <span class="label">Contact</span>
                  <span class="value">{facility.contact_info.phone}</span>
                  <span class="sub-value">{facility.contact_info.email}</span>
                </div>

                <div class="detail">
                  <span class="label">Capacity</span>
                  <span class="value">{facility.parking_capacity.toLocaleString()} spaces</span>
                </div>

                <div class="detail">
                  <span class="label">Services</span>
                  <div class="services-list">
                    {#each facility.services_available as service}
                      <span class="service-badge">{service}</span>
                    {/each}
                  </div>
                </div>
              </div>

              <div class="record-actions">
                <a href="/facilities/{facility.id}" class="action-button">View Details</a>
                <button class="action-button">Edit Facility</button>
                <button class="action-button">Schedule Maintenance</button>
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
</Layout>

<style>
  .facility-types {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .type-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .type-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .type-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .type-name {
    flex: 1;
    font-size: 0.95rem;
    color: var(--text-primary);
  }

  .type-count {
    font-weight: 600;
    color: var(--text-primary);
  }

  .type-bar-bg {
    height: 8px;
    background: var(--border-color);
    border-radius: 4px;
    overflow: hidden;
  }

  .type-bar {
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .type-dot.type-a,
  .type-bar.type-a {
    background: #15803d;
  }

  .type-dot.type-b,
  .type-bar.type-b {
    background: #1d4ed8;
  }

  .type-dot.type-c,
  .type-bar.type-c {
    background: #854d0e;
  }

  .facility-number {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .type-badge {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .type-badge.type-a {
    background: #dcfce7;
    color: #15803d;
  }

  .type-badge.type-b {
    background: #dbeafe;
    color: #1d4ed8;
  }

  .type-badge.type-c {
    background: #fef9c3;
    color: #854d0e;
  }

  .services-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .service-badge {
    padding: 0.375rem 0.75rem;
    background: color-mix(in srgb, var(--theme-color) 10%, transparent);
    color: var(--theme-color);
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  .service-stat {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: 12px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
  }

  .service-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .service-icon.repairs {
    background: linear-gradient(135deg, #dc2626, #ef4444);
  }

  .service-icon.fueling {
    background: linear-gradient(135deg, #0891b2, #06b6d4);
  }

  .service-icon.washing {
    background: linear-gradient(135deg, #7c3aed, #8b5cf6);
  }

  .service-icon.storage {
    background: linear-gradient(135deg, #0d9488, #14b8a6);
  }

  .service-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .service-count {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1;
  }

  .service-name {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  @media (max-width: 768px) {
    .services-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
</style> 
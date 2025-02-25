<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  
  let isNavExpanded = true;

  interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
  }

  interface ContactInfo {
    phone: string;
    email: string;
  }

  interface Facility {
    id: string;
    facility_number: string;
    name: string;
    type: string;
    address: Address;
    contact_info: ContactInfo;
    parking_capacity: number;
    services_available: string[];
    created_at: string;
    updated_at: string;
  }

  // Generate sample facilities
  const facilities: Facility[] = Array.from({ length: 15 }, (_, i): Facility => ({
    id: `facility_${i + 1}`,
    facility_number: `A${String(328 + i).padStart(3, '0')}-${1 + Math.floor(i/5)}${String.fromCharCode(65 + (i % 5))}`,
    name: [
      'Main Distribution Center',
      'North Regional Hub',
      'South Logistics Center',
      'East Coast Terminal',
      'West Coast Depot',
      'Central Processing Facility',
      'Cross-Dock Terminal',
      'Regional Sorting Center'
    ][i % 8],
    type: ['A', 'B', 'C'][i % 3],
    address: {
      street: `${1000 + i * 123} ${['Main', 'Industrial', 'Commerce', 'Transport', 'Logistics'][i % 5]} Street`,
      city: ['Albany', 'Buffalo', 'Rochester', 'Syracuse', 'Yonkers'][i % 5],
      state: 'NY',
      zip: String(10000 + (i * 37)).padStart(5, '0')
    },
    contact_info: {
      phone: `1-${String(300 + i).padStart(3, '0')}-${String(200 + i).padStart(3, '0')}-${String(1000 + i).padStart(4, '0')}`,
      email: `facility${i + 1}@example.com`
    },
    parking_capacity: 2000 + (i * 500),
    services_available: shuffle(['REPAIRS', 'FUELING', 'WASHING', 'STORAGE', 'MAINTENANCE']).slice(0, 1 + (i % 4)),
    created_at: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    updated_at: new Date(Date.now() - (i * 12 * 60 * 60 * 1000)).toISOString()
  }));

  // Helper function to shuffle array
  function shuffle<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
  }

  // Stats calculation
  const stats = {
    totalFacilities: facilities.length,
    totalCapacity: facilities.reduce((sum, f) => sum + f.parking_capacity, 0),
    averageUtilization: Math.round(
      facilities.reduce((sum, _, i) => 
        sum + (75 + (Math.sin(i) * 10) + (Math.random() * 10))
      , 0) / facilities.length
    )
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

  function handleSort(field: typeof sortField) {
    if (sortField === field) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field;
      sortDirection = 'desc';
    }
  }
</script>

<svelte:head>
  <title>Facility Management | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="facilities">
    <h1 class="facilities-title">Facility Management</h1>

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
      <div class="controls">
        <div class="search-box">
          <input
            type="text"
            class="search-input"
            placeholder="Search facilities..."
            bind:value={searchQuery}
          />
          <span class="search-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </span>
        </div>

        <div class="filter-group">
          <select
            class="filter-select"
            bind:value={selectedType}
          >
            {#each facilityTypes as type}
              <option value={type}>{type === 'ALL' ? 'All Types' : `Type ${type}`}</option>
            {/each}
          </select>

          <div class="sort-buttons">
            <button
              class="sort-button"
              class:active={sortField === 'name'}
              on:click={() => handleSort('name')}
            >
              Name {sortField === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </button>
            <button
              class="sort-button"
              class:active={sortField === 'parking_capacity'}
              on:click={() => handleSort('parking_capacity')}
            >
              Capacity {sortField === 'parking_capacity' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </button>
            <button
              class="sort-button"
              class:active={sortField === 'type'}
              on:click={() => handleSort('type')}
            >
              Type {sortField === 'type' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </button>
          </div>
        </div>
      </div>

      <div class="results-summary">
        Showing {paginatedRecords.length} of {filteredRecords.length} facilities
      </div>

      <div class="facilities-list">
        {#each paginatedRecords as facility}
          <div class="facility-item">
            <div class="facility-header">
              <div class="facility-title">
                <h3>{facility.name}</h3>
                <span class="facility-number">{facility.facility_number}</span>
              </div>
              <span class="type-badge type-{facility.type.toLowerCase()}">
                Type {facility.type}
              </span>
            </div>

            <div class="facility-details">
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

            <div class="facility-actions">
              <button class="action-button">View Details</button>
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
  </div>
</Layout>

<style>
  .facilities {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .facilities-title {
    font-size: 3rem;
    margin-bottom: 3rem;
    color: var(--text-primary);
    font-weight: 800;
    position: relative;
    letter-spacing: -1px;
  }

  .facilities-title::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 100px;
    height: 6px;
    background: var(--theme-gradient);
    border-radius: 3px;
  }

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

  .facility-item {
    background: var(--bg-secondary);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid var(--border-color);
    transition: all 0.2s ease;
  }

  .facility-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    border-color: var(--theme-color);
  }

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

  .facilities-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }

  .facility-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
  }

  .facility-title {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .facility-title h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
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

  .facility-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .detail {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .label {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .value {
    font-weight: 500;
    color: var(--text-primary);
  }

  .sub-value {
    font-size: 0.875rem;
    color: var(--text-secondary);
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

  .facility-actions {
    display: flex;
    gap: 1rem;
  }

  .action-button {
    padding: 0.625rem 1.25rem;
    background: color-mix(in srgb, var(--theme-color) 5%, var(--bg-secondary));
    border: 1px solid color-mix(in srgb, var(--theme-color) 15%, var(--border-color));
    border-radius: 8px;
    color: var(--theme-color);
    font-weight: 500;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .action-button:hover {
    background: var(--theme-color);
    color: white;
  }

  .controls {
    padding: 1.5rem 1.5rem 0;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1.5rem;
  }

  .search-box {
    flex: 1;
    min-width: 300px;
    position: relative;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 0.95rem;
  }

  .search-input:focus {
    outline: none;
    border-color: var(--theme-color);
  }

  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
  }

  .filter-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .filter-select {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 0.95rem;
    min-width: 200px;
  }

  .sort-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .sort-button {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-secondary);
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .sort-button:hover {
    border-color: var(--theme-color);
    color: var(--theme-color);
  }

  .sort-button.active {
    background: color-mix(in srgb, var(--theme-color) 10%, var(--bg-secondary));
    border-color: var(--theme-color);
    color: var(--theme-color);
  }

  .results-summary {
    padding: 1rem 1.5rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
    border-bottom: 1px solid var(--border-color);
  }

  .pagination {
    padding: 1.5rem;
    display: flex;
    justify-content: center;
  }

  .pagination-controls {
    display: flex;
    gap: 0.5rem;
  }

  .page-button {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .page-button:hover {
    border-color: var(--theme-color);
    color: var(--theme-color);
  }

  .page-button.active {
    background: color-mix(in srgb, var(--theme-color) 10%, var(--bg-secondary));
    border-color: var(--theme-color);
    color: var(--theme-color);
  }

  .page-ellipsis {
    color: var(--text-secondary);
    font-size: 0.9rem;
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
    .facilities {
      padding: 1rem;
    }

    .facilities-title {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    .controls {
      padding: 1rem 1rem 0;
      flex-direction: column;
    }

    .search-box {
      min-width: 100%;
    }

    .filter-group {
      flex-direction: column;
    }

    .sort-buttons {
      flex-wrap: wrap;
    }

    .sort-button {
      flex: 1;
      min-width: calc(50% - 0.25rem);
      text-align: center;
    }

    .results-summary {
      padding: 1rem;
    }

    .services-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
</style> 
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

  interface Driver {
    id: string;
    first_name: string;
    last_name: string;
    dob: string;
    license_number: string;
    license_state: string;
    license_expiration: string;
    phone: string;
    email: string;
    address: Address;
    employment_status: 'ACTIVE' | 'SUSPENDED' | 'ON_LEAVE' | 'TERMINATED';
    created_at: string;
    updated_at: string;
  }

  // Generate sample drivers
  const drivers: Driver[] = Array.from({ length: 20 }, (_, i): Driver => ({
    id: `driver_${i + 1}`,
    first_name: ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Maria', 'James', 'Lisa'][i % 8],
    last_name: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'][i % 8],
    dob: `${1970 + (i % 30)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
    license_number: `DL${String(10000 + i).padStart(5, '0')}`,
    license_state: ['NY', 'CA', 'TX', 'FL', 'IL', 'PA'][i % 6],
    license_expiration: `${2024 + (i % 5)}-${String(1 + (i % 12)).padStart(2, '0')}-${String(1 + (i % 28)).padStart(2, '0')}`,
    phone: `(${String(200 + (i % 799)).padStart(3, '0')}) ${String(555).padStart(3, '0')}-${String(1000 + i).padStart(4, '0')}`,
    email: `driver${i + 1}@example.com`,
    address: {
      street: `${1000 + i} Main St`,
      city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'][i % 6],
      state: ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA'][i % 6],
      zip: String(10000 + (i * 37)).padStart(5, '0')
    },
    employment_status: ['ACTIVE', 'SUSPENDED', 'ON_LEAVE', 'TERMINATED'][i % 4],
    created_at: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    updated_at: new Date(Date.now() - (i * 12 * 60 * 60 * 1000)).toISOString()
  }));

  // Stats calculation
  const stats = {
    active: drivers.filter(d => d.employment_status === 'ACTIVE').length,
    suspended: drivers.filter(d => d.employment_status === 'SUSPENDED').length,
    onLeave: drivers.filter(d => d.employment_status === 'ON_LEAVE').length,
    total: drivers.length
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
  const statusTypes = ['ALL', 'ACTIVE', 'SUSPENDED', 'ON_LEAVE', 'TERMINATED'];

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  function handleSort(field: typeof sortField) {
    if (sortField === field) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortField = field;
      sortDirection = 'asc';
    }
  }
</script>

<svelte:head>
  <title>Driver Management | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="drivers">
    <h1 class="drivers-title">Driver Management</h1>

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

      <Card title="On Leave" icon={icons.drivers}>
        <div class="stat-content">
          <p class="stat-number">{stats.onLeave}</p>
          <p class="stat-label">Currently on Leave</p>
        </div>
      </Card>

      <Card title="Total Drivers" icon={icons.drivers}>
        <div class="stat-content">
          <p class="stat-number">{stats.total}</p>
          <p class="stat-label">Total Registered</p>
        </div>
      </Card>
    </div>

    <Card title="Driver Records" icon={icons.drivers}>
      <div class="controls">
        <div class="search-box">
          <input
            type="text"
            placeholder="Search drivers..."
            bind:value={searchQuery}
            class="search-input"
          />
          <span class="search-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </span>
        </div>

        <div class="filter-group">
          <select 
            bind:value={selectedStatus}
            class="filter-select"
          >
            {#each statusTypes as type}
              <option value={type}>
                {type === 'ALL' ? 'All Statuses' : type.replace('_', ' ')}
              </option>
            {/each}
          </select>

          <div class="sort-buttons">
            <button
              class="sort-button"
              class:active={sortField === 'last_name'}
              class:asc={sortField === 'last_name' && sortDirection === 'asc'}
              on:click={() => handleSort('last_name')}
            >
              Name {sortField === 'last_name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </button>
            <button
              class="sort-button"
              class:active={sortField === 'license_expiration'}
              class:asc={sortField === 'license_expiration' && sortDirection === 'asc'}
              on:click={() => handleSort('license_expiration')}
            >
              License Exp. {sortField === 'license_expiration' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </button>
            <button
              class="sort-button"
              class:active={sortField === 'employment_status'}
              class:asc={sortField === 'employment_status' && sortDirection === 'asc'}
              on:click={() => handleSort('employment_status')}
            >
              Status {sortField === 'employment_status' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </button>
          </div>
        </div>
      </div>

      <div class="results-summary">
        Showing {filteredRecords.length} of {drivers.length} drivers
      </div>

      <div class="records-list">
        {#each paginatedRecords as driver}
          <div class="record-item">
            <div class="driver-header">
              <div class="driver-title">
                <div class="avatar">
                  {driver.first_name[0]}{driver.last_name[0]}
                </div>
                <div class="driver-info">
                  <h3>{driver.first_name} {driver.last_name}</h3>
                  <p class="driver-contact">{driver.email} • {driver.phone}</p>
                </div>
              </div>
              <span class="status-badge {driver.employment_status.toLowerCase()}">
                {driver.employment_status.replace('_', ' ')}
              </span>
            </div>

            <div class="driver-details">
              <div class="detail">
                <span class="label">License</span>
                <span class="value">{driver.license_number}</span>
                <span class="sub-value">{driver.license_state} • Expires: {formatDate(driver.license_expiration)}</span>
              </div>

              <div class="detail">
                <span class="label">Address</span>
                <span class="value">{driver.address.street}</span>
                <span class="sub-value">{driver.address.city}, {driver.address.state} {driver.address.zip}</span>
              </div>
            </div>

            <div class="driver-actions">
              <button class="action-button">View Details</button>
              <button class="action-button">Edit</button>
              <button class="action-button">Update Status</button>
            </div>
          </div>
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
  </div>
</Layout>

<style>
  .drivers {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .drivers-title {
    font-size: 3rem;
    margin-bottom: 3rem;
    color: var(--text-primary);
    font-weight: 800;
    position: relative;
    letter-spacing: -1px;
  }

  .drivers-title::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    width: 100px;
    height: 6px;
    background: var(--theme-gradient);
    border-radius: 3px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .avatar {
    width: 48px;
    height: 48px;
    background: var(--theme-gradient);
    color: white;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.1rem;
    margin-right: 1rem;
  }

  .driver-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
  }

  .driver-title {
    display: flex;
    align-items: center;
  }

  .driver-info h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }

  .driver-contact {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .status-badge.active {
    background: #dcfce7;
    color: #15803d;
  }

  .status-badge.suspended {
    background: #fee2e2;
    color: #dc2626;
  }

  .status-badge.on_leave {
    background: #fef9c3;
    color: #854d0e;
  }

  .status-badge.terminated {
    background: #f3f4f6;
    color: #4b5563;
  }

  .driver-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

  .driver-actions {
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
    border-top: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .pagination-info {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .pagination-controls {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
  }

  .page-button {
    padding: 0.5rem 0.75rem;
    min-width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-secondary);
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .page-button:hover:not(:disabled) {
    border-color: var(--theme-color);
    color: var(--theme-color);
  }

  .page-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .page-button.active {
    background: var(--theme-color);
    border-color: var(--theme-color);
    color: white;
  }

  .page-ellipsis {
    color: var(--text-secondary);
    padding: 0 0.5rem;
  }

  @media (max-width: 768px) {
    .drivers {
      padding: 1rem;
    }

    .drivers-title {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .driver-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .driver-details {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .driver-actions {
      flex-direction: column;
    }

    .action-button {
      width: 100%;
      text-align: center;
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

    .pagination {
      padding: 1rem;
    }

    .pagination-controls {
      gap: 0.25rem;
    }

    .page-button {
      padding: 0.4rem 0.6rem;
      min-width: 2.2rem;
      height: 2.2rem;
      font-size: 0.85rem;
    }
  }
</style> 
<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import ListControls from '$lib/components/ListControls.svelte';
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

  function formatStatusLabel(status: string): string {
    if (status === 'ALL') return 'All Statuses';
    return status.split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  function formatStatusBadge(status: string): string {
    return status.replace('_', ' ');
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
</script>

<svelte:head>
  <title>Driver Management | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    <h1 class="page-title">Driver Management</h1>

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
      <ListControls
        searchPlaceholder="Search drivers..."
        bind:searchQuery
        bind:selectedFilter={selectedStatus}
        filterOptions={statusTypes}
        {formatStatusLabel}
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
          <div class="record-item">
            <div class="record-header">
              <div class="record-title">
                <div class="avatar">
                  {driver.first_name[0]}{driver.last_name[0]}
                </div>
                <div class="driver-info">
                  <h3>{driver.first_name} {driver.last_name}</h3>
                  <p class="driver-contact">{driver.email} • {driver.phone}</p>
                </div>
              </div>
              <span class="status-badge {driver.employment_status.toLowerCase()}">
                {formatStatusBadge(driver.employment_status)}
              </span>
            </div>

            <div class="record-details">
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

            <div class="record-actions">
              <a href="/drivers/{driver.id}" class="action-button">View Details</a>
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

  .action-button.primary {
    padding: var(--spacing-md) var(--spacing-xl);
    background: var(--theme-color);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition-all);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
  }

  .action-button.primary:hover {
    opacity: 0.9;
  }
</style> 
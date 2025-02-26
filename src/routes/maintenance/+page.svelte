<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import { formatLargeNumber, formatCurrency, formatDate } from '$lib/utils/format';
  
  let isNavExpanded = true;

  // Types matching API response
  interface MaintenanceLog {
    id: string;
    truck: {
      id: string;
      truck_number: string;
      vin: string;
      make: string;
      model: string;
      year: number;
      license_plate: {
        number: string;
        state: string;
      };
      mileage: number;
      status: string;
      trailer_type: string;
      capacity_tons: number;
      fuel_type: string;
      last_maintenance: string;
    };
    date: string;
    service_type: string;
    cost: number;
    notes: string;
    mechanic: string;
    location: string;
    created_at: string;
    updated_at: string;
  }

  // Pagination settings
  let currentPage = 1;
  const recordsPerPage = 5;

  // Generate more dummy records
  const maintenanceRecords: MaintenanceLog[] = Array.from({ length: 25 }, (_, i) => ({
    id: `67b0eceac7baa8eb47fafe${(76 + i).toString().padStart(2, '0')}`,
    truck: {
      id: `67b0d790c7baa8eb47fafe${(70 + i % 8).toString().padStart(2, '0')}`,
      truck_number: ['A236286', 'B445789', 'C789012', 'D123456', 'E567890', 'F891234', 'G345678', 'H901234'][i % 8],
      vin: `VIN${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      make: ['Ford', 'Peterbilt', 'Kenworth', 'Freightliner', 'Volvo', 'Mack'][i % 6],
      model: ['F-750', '579', 'T680', 'Cascadia', 'VNL', 'Anthem'][i % 6],
      year: 2018 + (i % 5),
      license_plate: {
        number: `TR${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        state: ['NY', 'CA', 'TX', 'FL', 'IL', 'PA'][i % 6]
      },
      mileage: 75000 + (i * 5000),
      status: ['IN_TRANSIT', 'MAINTENANCE', 'AVAILABLE'][i % 3],
      trailer_type: ['DRY_VAN', 'REFRIGERATED', 'FLATBED'][i % 3],
      capacity_tons: 5 + (i % 4),
      fuel_type: 'DIESEL',
      last_maintenance: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
    },
    date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    service_type: ['ROUTINE_MAINTENANCE', 'REPAIR', 'EMERGENCY'][i % 3],
    cost: 1500 + Math.random() * 3000,
    notes: [
      'Regular maintenance check. All systems normal.',
      'Brake system inspection and repair.',
      'Engine overheating issue resolved.',
      'Transmission fluid replacement.',
      'Tire rotation and replacement.',
      'Air filter replacement and system check.',
      'Electrical system diagnostics.',
      'Suspension system maintenance.'
    ][i % 8],
    mechanic: [
      'Alan Michaels',
      'Sarah Chen',
      'Robert Martinez',
      'Jessica Thompson',
      'Michael Rodriguez',
      'Emily Parker'
    ][i % 6],
    location: [
      'Golden Auto Shop, Albany, NY',
      'TruckCare Center, Los Angeles, CA',
      'Truck Masters, Houston, TX',
      'Fleet Services, Miami, FL',
      'Midwest Repairs, Chicago, IL',
      'Eastern Transport, Philadelphia, PA'
    ][i % 6],
    created_at: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    updated_at: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString()
  }));

  // Update the stats calculation
  const stats = {
    routine: maintenanceRecords.filter(r => r.service_type === 'ROUTINE_MAINTENANCE').length,
    repair: maintenanceRecords.filter(r => r.service_type === 'REPAIR').length,
    emergency: maintenanceRecords.filter(r => r.service_type === 'EMERGENCY').length,
    totalCost: formatLargeNumber(
      maintenanceRecords.reduce((sum, record) => sum + record.cost, 0)
    )
  };

  // Search and filter state
  let searchQuery = '';
  let selectedServiceType: string = 'ALL';
  let sortField: 'date' | 'cost' | 'truck_number' = 'date';
  let sortDirection: 'asc' | 'desc' = 'desc';

  // Service type options
  const serviceTypes = ['ALL', 'ROUTINE_MAINTENANCE', 'REPAIR', 'EMERGENCY'];

  // Filtered and sorted records
  $: filteredRecords = maintenanceRecords
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
  <title>Maintenance Management | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="maintenance">
    <h1 class="maintenance-title">Maintenance Management</h1>

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

      <Card title="Total Costs" icon={icons.maintenance}>
        <div class="stat-content">
          <p class="stat-number">{stats.totalCost}</p>
          <p class="stat-label">This period</p>
        </div>
      </Card>
    </div>

    <Card title="Maintenance Records" icon={icons.maintenance}>
      <div class="controls">
        <div class="search-box">
          <input
            type="text"
            placeholder="Search records..."
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
            bind:value={selectedServiceType}
            class="filter-select"
          >
            {#each serviceTypes as type}
              <option value={type}>
                {type === 'ALL' ? 'All Types' : type.replace('_', ' ')}
              </option>
            {/each}
          </select>

          <div class="sort-buttons">
            <button
              class="sort-button"
              class:active={sortField === 'date'}
              class:asc={sortField === 'date' && sortDirection === 'asc'}
              on:click={() => handleSort('date')}
            >
              Date {sortField === 'date' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </button>
            <button
              class="sort-button"
              class:active={sortField === 'cost'}
              class:asc={sortField === 'cost' && sortDirection === 'asc'}
              on:click={() => handleSort('cost')}
            >
              Cost {sortField === 'cost' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </button>
            <button
              class="sort-button"
              class:active={sortField === 'truck_number'}
              class:asc={sortField === 'truck_number' && sortDirection === 'asc'}
              on:click={() => handleSort('truck_number')}
            >
              Truck # {sortField === 'truck_number' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
            </button>
          </div>
        </div>
      </div>

      <div class="results-summary">
        Showing {filteredRecords.length} of {maintenanceRecords.length} records
      </div>

      <div class="record-list">
        {#each paginatedRecords as record}
          <div class="record-item">
            <div class="item-header">
              <div class="item-title">
                <h3>{record.truck.make} {record.truck.model} ({record.truck.truck_number})</h3>
                <span class="chip {record.service_type.toLowerCase()}">{record.service_type.replace('_', ' ')}</span>
              </div>
              <div class="cost">
                {formatCurrency(record.cost)}
              </div>
            </div>

            <div class="item-details">
              <div class="detail">
                <span class="label">Date:</span>
                <span class="value">{formatDate(record.date)}</span>
              </div>
              <div class="detail">
                <span class="label">Mechanic:</span>
                <span class="value">{record.mechanic}</span>
              </div>
              <div class="detail">
                <span class="label">Mileage:</span>
                <span class="value">{record.truck.mileage.toLocaleString()} miles</span>
              </div>
              <div class="detail">
                <span class="label">Location:</span>
                <span class="value">{record.location}</span>
              </div>
            </div>

            <p class="description">{record.notes}</p>

            <div class="item-actions">
              <button class="action-button">View Full Details</button>
              <button class="action-button">Update Record</button>
            </div>
          </div>
        {/each}
      </div>

      <div class="pagination">
        <div class="pagination-info">
          Showing {(currentPage - 1) * recordsPerPage + 1} to {Math.min(currentPage * recordsPerPage, filteredRecords.length)} of {filteredRecords.length} records
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
  .maintenance {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .maintenance-title {
    font-size: 3rem;
    margin-bottom: 3rem;
    color: var(--text-primary);
    font-weight: 800;
    position: relative;
    letter-spacing: -1px;
  }

  .maintenance-title::after {
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
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .item-title {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .item-title h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .chip {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
  }

  .chip.routine_maintenance {
    background: #dbeafe;
    color: #2563eb;
  }

  .chip.repair {
    background: #fef3c7;
    color: #d97706;
  }

  .chip.emergency {
    background: #fee2e2;
    color: #dc2626;
  }

  .item-priority {
    font-size: 0.875rem;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 8px;
  }

  .item-priority.high {
    background: #fee2e2;
    color: #dc2626;
  }

  .item-priority.medium {
    background: #fef3c7;
    color: #d97706;
  }

  .item-priority.critical {
    background: #fecaca;
    color: #b91c1c;
  }

  .item-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
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

  .description {
    color: var(--text-secondary);
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }

  .item-actions {
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

  .cost {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--theme-color);
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
    .maintenance {
      padding: 1rem;
    }

    .maintenance-title {
      font-size: 2rem;
      margin-bottom: 2rem;
    }

    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .maintenance-item {
      padding: 1rem;
    }

    .item-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .item-details {
      grid-template-columns: 1fr;
    }

    .item-actions {
      flex-direction: column;
    }

    .action-button {
      width: 100%;
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
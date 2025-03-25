<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import type { Truck } from '$lib/api/trucks';
  import { 
    setTruckAvailable,
    setTruckInTransit,
    setTruckInMaintenance,
    retireTruck,
    type TruckStatus,
    getAvailableStatusTransitions
  } from '$lib/api/trucks';
  import TruckStatusModal from '$lib/components/TruckStatusModal.svelte';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  
  let isNavExpanded = true;
  
  export let data;
  let truck: Truck = data.truck;

  let isUpdateStatusModalOpen = false;

  function openUpdateStatus() {
    if (truck.status === 'RETIRED') {
      console.error('Cannot update retired truck');
      return;
    }
    isUpdateStatusModalOpen = true;
  }

  function closeUpdateStatus() {
    isUpdateStatusModalOpen = false;
  }

  async function handleUpdateStatus(newStatus: TruckStatus) {
    try {
      let updatedTruck: Truck;

      switch (newStatus) {
        case 'AVAILABLE':
          updatedTruck = await setTruckAvailable(truck.id);
          break;
        case 'IN_TRANSIT':
          updatedTruck = await setTruckInTransit(truck.id);
          break;
        case 'UNDER_MAINTENANCE':
          updatedTruck = await setTruckInMaintenance(truck.id);
          break;
        case 'RETIRED':
          updatedTruck = await retireTruck(truck.id);
          break;
        default:
          throw new Error('Invalid status selected');
      }

      truck = updatedTruck;
    } catch (error) {
      console.error('Failed to update status:', error);
      throw error;
    }
  }

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
</script>

<svelte:head>
  <title>{truck?.make ?? 'Truck'} {truck?.model ?? 'Details'} | Waybill</title>
</svelte:head>

<Layout {isNavExpanded}>
  <div class="page">
    {#if !truck}
      <div class="loading">Loading truck details...</div>
    {:else}
      <a href="/trucks" class="back-link">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back to Fleet Management
      </a>

      <div class="incident-header">
        <div class="header-top">
          <div class="incident-id">
            <h1>Truck Profile</h1>
            <div class="id-number">{truck.make} {truck.model}</div>
          </div>
          
          <div class="header-controls">
            <a href="/maintenance/new?truck={truck.id}" class="action-button primary">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Schedule Maintenance
            </a>
            {#if truck.status !== 'RETIRED'}
              <button class="action-button primary" on:click={openUpdateStatus}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.17-5.24l-1.1-1.1c.71-1.33.53-3.01-.59-4.13-1.38-1.38-1.38-3.61-1.38-4.99 0-1.38 1.38-1.38 3.61 0 4.99 1.12 1.12 2.8 1.31 4.13.59l1.1 1.1c.19.19.45.29.71.29.26 0 .52-.1.71-.29.39-.39.39-1.02 0-1.41z"/>
                </svg>
                Update Status
              </button>
            {/if}
            <button class="edit-control">
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Details
            </button>
          </div>
        </div>

        <div class="incident-meta">
          <StatusBadge status={truck.status} type="truck" />
          <div class="meta-divider"></div>
          <div class="date-reported">
            <span class="label">TRUCK NUMBER</span>
            <span class="value">#{truck.truck_number}</span>
          </div>
          <div class="meta-divider"></div>
          <div class="damage-estimate">
            <span class="label">MILEAGE</span>
            <span class="value highlight">{formatNumber(truck.mileage)} miles</span>
          </div>
        </div>
      </div>

      <div class="resource-page-details-grid">
        <Card title="Vehicle Information" icon={icons.truck}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Make & Model</span>
                <span class="resource-page-detail-value highlight">{truck.make} {truck.model}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Year</span>
                <span class="resource-page-detail-value">{truck.year}</span>
              </div>
            </div>
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">VIN</span>
                <span class="resource-page-detail-value mono">{truck.vin}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">License Plate</span>
                <span class="resource-page-detail-value mono">{truck.license_plate.number} <span class="state">({truck.license_plate.state})</span></span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Specifications" icon={icons.settings}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Trailer Type</span>
                <span class="resource-page-detail-value highlight">{truck.trailer_type.replace('_', ' ')}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Capacity</span>
                <span class="resource-page-detail-value">{truck.capacity_tons} tons</span>
              </div>
            </div>
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Fuel Type</span>
                <span class="resource-page-detail-value">{truck.fuel_type}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Usage & Maintenance" icon={icons.chart}>
          <div class="resource-page-detail-group">
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Current Mileage</span>
                <span class="resource-page-detail-value highlight">{formatNumber(truck.mileage)} miles</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Last Maintenance</span>
                <span class="resource-page-detail-value">{formatDate(truck.last_maintenance)}</span>
              </div>
            </div>
            <div class="resource-page-detail-row">
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Added to Fleet</span>
                <span class="resource-page-detail-value">{formatDate(truck.created_at)}</span>
              </div>
              <div class="resource-page-detail-item">
                <span class="resource-page-detail-label">Last Updated</span>
                <span class="resource-page-detail-value">{formatDate(truck.updated_at)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    {/if}
  </div>
</Layout>

<TruckStatusModal
  isOpen={isUpdateStatusModalOpen}
  onClose={closeUpdateStatus}
  onSubmit={handleUpdateStatus}
  availableStatuses={truck.status !== 'RETIRED' ? getAvailableStatusTransitions(truck.status) : []}
/>

<style>
  .state {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .incident-header {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    margin: var(--spacing-lg) 0 var(--spacing-2xl);
    max-width: 100%;
    overflow: hidden;
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-lg);
    flex-wrap: wrap;
    gap: var(--spacing-lg);
  }

  .incident-id {
    flex: 1;
    min-width: 280px;
  }

  .incident-id h1 {
    font-size: var(--font-size-xl);
    color: var(--text-secondary);
    font-weight: 500;
    margin: 0 0 var(--spacing-xs);
  }

  .id-number {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--text-primary);
    font-family: var(--font-mono);
    letter-spacing: -0.5px;
  }

  .incident-meta {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    flex-wrap: wrap;
  }

  .meta-divider {
    width: 1px;
    height: 24px;
    background: var(--border-color);
  }

  .date-reported,
  .damage-estimate {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .label {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  .value {
    font-size: var(--font-size-md);
    color: var(--text-primary);
    font-weight: 500;
  }

  .value.highlight {
    color: var(--theme-color);
    font-size: var(--font-size-xl);
    font-weight: 600;
  }

  .edit-control {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-lg);
    background: rgb(99, 102, 241);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .edit-control:hover {
    background: rgb(79, 82, 231);
  }

  .header-controls {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
  }

  .action-button {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-lg);
    background: white;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .action-button.primary {
    background: rgb(99, 102, 241);
    color: white;
    border: none;
  }

  .action-button.primary:hover {
    background: rgb(79, 82, 231);
  }

  @media (max-width: 480px) {
    .header-controls {
      flex-direction: column;
      width: 100%;
    }

    .header-controls button {
      width: 100%;
      justify-content: center;
    }
  }

  .loading {
    text-align: center;
    padding: 2rem;
    color: var(--text-secondary);
  }
</style> 
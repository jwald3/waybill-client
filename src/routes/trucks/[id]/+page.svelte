<script lang="ts">
  import Layout from '$lib/components/Layout.svelte';
  import Card from '$lib/components/Card.svelte';
  import { icons } from '$lib/icons';
  import type { Truck } from '$lib/api/trucks';
  
  let isNavExpanded = true;
  
  export let data;
  const truck: Truck = data.truck;

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
      <div class="page-header">
        <div class="header-content">
          <a href="/trucks" class="back-link">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Fleet Management
          </a>
          <div class="title-section">
            <h1 class="page-title">{truck.make} {truck.model}</h1>
            <div class="truck-meta">
              <span class="truck-number">#{truck.truck_number}</span>
              <span class="status-badge {truck.status.toLowerCase()}">
                {truck.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="details-grid">
        <Card title="Vehicle Information" icon={icons.truck}>
          <div class="detail-group">
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Make & Model</span>
                <span class="value highlight">{truck.make} {truck.model}</span>
              </div>
              <div class="detail-item">
                <span class="label">Year</span>
                <span class="value">{truck.year}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">VIN</span>
                <span class="value mono">{truck.vin}</span>
              </div>
              <div class="detail-item">
                <span class="label">License Plate</span>
                <span class="value mono">{truck.license_plate.number} <span class="state">({truck.license_plate.state})</span></span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Specifications" icon={icons.settings}>
          <div class="detail-group">
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Trailer Type</span>
                <span class="value highlight">{truck.trailer_type.replace('_', ' ')}</span>
              </div>
              <div class="detail-item">
                <span class="label">Capacity</span>
                <span class="value">{truck.capacity_tons} tons</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Fuel Type</span>
                <span class="value">{truck.fuel_type}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Usage & Maintenance" icon={icons.chart}>
          <div class="detail-group">
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Current Mileage</span>
                <span class="value highlight">{formatNumber(truck.mileage)} miles</span>
              </div>
              <div class="detail-item">
                <span class="label">Last Maintenance</span>
                <span class="value">{formatDate(truck.last_maintenance)}</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-item">
                <span class="label">Added to Fleet</span>
                <span class="value">{formatDate(truck.created_at)}</span>
              </div>
              <div class="detail-item">
                <span class="label">Last Updated</span>
                <span class="value">{formatDate(truck.updated_at)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div class="action-buttons">
        <button class="action-button primary">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Schedule Maintenance
        </button>
        <button class="action-button">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.17-5.24l-1.1-1.1c.71-1.33.53-3.01-.59-4.13-1.38-1.38-1.38-3.61-1.38-4.99 0-1.38 1.38-1.38 3.61 0 4.99 1.12 1.12 2.8 1.31 4.13.59l1.1 1.1c.19.19.45.29.71.29.26 0 .52-.1.71-.29.39-.39.39-1.02 0-1.41z"/>
          </svg>
          Update Status
        </button>
        <button class="action-button">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
          Edit Details
        </button>
      </div>
    {/if}
  </div>
</Layout>

<style>
  .page-header {
    margin-bottom: 2.5rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1.5rem;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    text-decoration: none;
    margin-bottom: 1.25rem;
    font-size: 0.9rem;
  }

  .back-link:hover {
    color: var(--theme-color);
  }

  .title-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .truck-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .truck-number {
    font-size: 1.1rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .status-badge.in_transit {
    background: #dbeafe;
    color: #1d4ed8;
  }

  .status-badge.maintenance {
    background: #fee2e2;
    color: #dc2626;
  }

  .status-badge.available {
    background: #dcfce7;
    color: #15803d;
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }

  .detail-group {
    padding: 1.5rem;
  }

  .detail-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-bottom: 1.5rem;
  }

  .detail-row:last-child {
    margin-bottom: 0;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .value {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--text-primary);
  }

  .value.highlight {
    color: var(--theme-color);
    font-weight: 600;
  }

  .value.mono {
    font-family: monospace;
    letter-spacing: 0.5px;
  }

  .state {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .action-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: white;
    color: var(--text-primary);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .action-button:hover {
    border-color: var(--theme-color);
    color: var(--theme-color);
  }

  .action-button.primary {
    background: var(--theme-color);
    color: white;
    border-color: var(--theme-color);
  }

  .action-button.primary:hover {
    background: var(--theme-color-dark);
    border-color: var(--theme-color-dark);
    color: white;
  }
</style> 